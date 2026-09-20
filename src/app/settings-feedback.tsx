import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { push, ref, set } from 'firebase/database';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Import trực tiếp từ file cấu hình chung (thêm định nghĩa kiểu any để VS Code không gạch đỏ)
import * as CellularFirebase from '../firebaseConfig';
const auth: any = CellularFirebase.auth;
const db: any = CellularFirebase.db;

export default function SettingsFeedbackScreen() {
  const [feedbackType, setFeedbackType] = useState('Báo lỗi ứng dụng');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  const options = [
    'Báo lỗi ứng dụng',
    'Góp ý cải thiện tính năng',
    'Lỗi kết nối thiết bị phần cứng (ESP32)',
    'Khác'
  ];

  const handleSendFeedback = async () => {
    if (!feedbackContent.trim()) {
      setErrorMessage('Vui lòng nhập nội dung góp ý của bạn!');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setErrorMessage(''); 

    try {
      const feedbackRef = ref(db, 'feedbacks');
      const newFeedbackRef = push(feedbackRef);

      await set(newFeedbackRef, {
        type: feedbackType,
        content: feedbackContent,
        userEmail: auth.currentUser?.email || 'Ẩn danh',
        userName: auth.currentUser?.displayName || 'Người dùng',
        createdAt: new Date().toISOString()
      });

      setSuccessModalVisible(true);
    } catch (error: any) {
      setErrorMessage('Lỗi: ' + error.message);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };


  return (
    <SafeAreaView style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Liên hệ & Gửi Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Kênh hỗ trợ trực tiếp</Text>
          <View style={styles.card}>
            <View style={styles.contactRow}>
              <Ionicons name="call" size={20} color="#f57c00" />
              <Text style={styles.contactText}>Hotline: <Text style={styles.contactBold}>1900 xxxx (24/7)</Text></Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={20} color="#f57c00" />
              <Text style={styles.contactText}>Email: <Text style={styles.contactBold}>support@babycrymonitor.vn</Text></Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Biểu mẫu góp ý ý kiến</Text>
          
          <TouchableOpacity style={styles.dropdownBox} onPress={() => setModalVisible(true)}>
            <Text style={styles.dropdownText}>{feedbackType}</Text>
            <Ionicons name="chevron-down" size={18} color="#555" />
          </TouchableOpacity>

          <View style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập chi tiết ý kiến hoặc vấn đề bạn gặp phải..."
              placeholderTextColor="#888"
              multiline
              textAlignVertical="top"
              value={feedbackContent}
              onChangeText={(text) => {
                setFeedbackContent(text);
                if (text.trim()) setErrorMessage(''); 
              }}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSendFeedback}>
            <Text style={styles.submitText}>GỬI PHẢN HỒI</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {errorMessage ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{errorMessage}</Text>
        </View>
      ) : null}

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => {
                    setFeedbackType(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, feedbackType === item && { fontWeight: 'bold', color: '#f57c00' }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Cảm ơn bạn!</Text>
            <Text style={styles.successDesc}>
              Phản hồi của bạn đã được gửi thành công đến đội ngũ phát triển đồ án.
            </Text>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => {
                setSuccessModalVisible(false);
                setFeedbackContent('');
                router.back(); 
              }}
            >
              <Text style={styles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f4f5f7' },
  customHeader: { 
    backgroundColor: '#21335b', 
    paddingTop: 45, 
    paddingBottom: 16, 
    paddingHorizontal: 16,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%'
  },
  backButton: { padding: 4 },
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1
  },
  container: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 10, marginTop: 10 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 20 
  },
  contactText: { fontSize: 15, color: '#333', marginLeft: 12 },
  contactBold: { fontWeight: 'bold', color: '#21335b' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 52 },
  dropdownBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownText: { fontSize: 15, color: '#333', fontWeight: 'bold' },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    height: 160,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    textAlignVertical: 'top'
  },
  submitBtn: {
    backgroundColor: '#21335b',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  errorBanner: {
    backgroundColor: '#d32f2f',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  successBox: {
    width: '82%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'flex-start',
    elevation: 5,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  successDesc: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 24,
  },
  closeBtn: {
    backgroundColor: '#21335b',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  }
});
