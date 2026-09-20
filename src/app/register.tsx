import React, { useState } from 'react';
    import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
    import { Ionicons } from '@expo/vector-icons';
    import { router, Stack } from 'expo-router';
    import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
    import { auth } from '../../src/firebaseConfig';

    export default function RegisterScreen() {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

      const handleRegister = async () => {
        if (!name || !email || !password) {
          Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
          return;
        }
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          // Cập nhật tên hiển thị cho tài khoản
          await updateProfile(userCredential.user, { displayName: name });
          Alert.alert("Thành công", "Tạo tài khoản thành công!", [
            { text: "Đăng nhập ngay", onPress: () => router.back() }
          ]);
        } catch (error: any) {
          Alert.alert("Đăng ký thất bại", error.message);
        }
      };

      return (
        <SafeAreaView style={styles.container}>
          <Stack.Screen options={{ headerShown: false }} />
          
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>TẠO TÀI KHOẢN</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={20} color="#555" style={styles.iconInput} />
              <TextInput placeholder="Tên đăng nhập" placeholderTextColor="#888" style={styles.input} value={name} onChangeText={setName} />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#555" style={styles.iconInput} />
              <TextInput placeholder="Địa chỉ Gmail" placeholderTextColor="#888" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.iconInput} />
              <TextInput placeholder="Mật khẩu" placeholderTextColor="#888" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
            </View>

            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
              <Text style={styles.registerText}>XÁC NHẬN ĐĂNG KÝ</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    const styles = StyleSheet.create({
      container: { flex: 1, backgroundColor: '#21335b', padding: 24, justifyContent: 'center' },
      headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 40, letterSpacing: 1 },
      formContainer: { width: '100%' },
      inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, paddingHorizontal: 15, height: 56 },
      iconInput: { marginRight: 10 },
      input: { flex: 1, fontSize: 16, color: '#333' },
      registerBtn: { backgroundColor: '#81c784', borderRadius: 12, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
      registerText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
    });