import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { 
  Alert, 
  Keyboard, 
  KeyboardAvoidingView, 
  Modal, 
  Platform, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View 
} from 'react-native';
import { auth } from '../firebaseConfig'; 

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [forgotVisible, setForgotVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/(tabs)/home' as any);
    } catch (error: any) {
      Alert.alert("Đăng nhập thất bại", "Email hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      Alert.alert("Lỗi", "Vui lòng nhập email khôi phục!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      Alert.alert("Thành công", "Đã gửi link khôi phục mật khẩu vào Email của bạn!");
      setForgotVisible(false);
      setResetEmail('');
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            <View style={styles.logoContainer}>
              <Ionicons name="happy" size={90} color="#fff" />
              <Text style={styles.appName}>GIÁM SÁT BÉ YÊU</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={20} color="#555" style={styles.iconInput} />
                <TextInput 
                  placeholder="Email đăng nhập" 
                  placeholderTextColor="#888" 
                  style={styles.input} 
                  value={email} 
                  onChangeText={setEmail} 
                  autoCapitalize="none" 
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.iconInput} />
                <TextInput 
                  placeholder="Mật khẩu" 
                  placeholderTextColor="#888" 
                  secureTextEntry 
                  style={styles.input} 
                  value={password} 
                  onChangeText={setPassword} 
                />
              </View>

              <TouchableOpacity style={styles.checkboxRow} onPress={() => setRemember(!remember)}>
                <Ionicons name={remember ? "checkbox" : "square-outline"} size={22} color="#fbc02d" />
                <Text style={styles.checkboxText}>Ghi nhớ thiết bị đăng nhập</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginText}>{loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/register' as any)}>
                <Text style={styles.registerText}>ĐĂNG KÝ TÀI KHOẢN</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotContainer} onPress={() => setForgotVisible(true)}>
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Modal Quên Mật Khẩu */}
      <Modal visible={forgotVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Khôi phục mật khẩu</Text>
            <View style={styles.inputBoxModal}>
              <Ionicons name="mail-outline" size={20} color="#555" style={{ marginRight: 10 }} />
              <TextInput 
                placeholder="Nhập Email bạn đã đăng ký..." 
                placeholderTextColor="#888" 
                style={{ flex: 1, color: '#333' }} 
                value={resetEmail} 
                onChangeText={setResetEmail} 
                autoCapitalize="none" 
              />
            </View>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity onPress={() => setForgotVisible(false)}>
                <Text style={{ color: '#666', fontSize: 16 }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSendBtn} onPress={handleResetPassword}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gửi link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#21335b' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  formContainer: { width: '100%' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, paddingHorizontal: 15, height: 56 },
  iconInput: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkboxText: { color: '#fff', marginLeft: 8, fontSize: 15 },
  loginBtn: { backgroundColor: '#ffb74d', borderRadius: 12, height: 54, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  loginText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  registerBtn: { borderWidth: 2, borderColor: '#ffb74d', borderRadius: 12, height: 54, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  registerText: { color: '#ffb74d', fontSize: 16, fontWeight: 'bold' },
  forgotContainer: { alignItems: 'center' },
  forgotText: { color: '#fff', textDecorationLine: 'underline', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#21335b', textAlign: 'center' },
  inputBoxModal: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 10, paddingHorizontal: 12, height: 50, marginBottom: 20 },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalSendBtn: { backgroundColor: '#ffb74d', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }
});