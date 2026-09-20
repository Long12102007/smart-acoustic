import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsNotificationScreen() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isVibrate, setIsVibrate] = useState(true);
  const [isPopup, setIsPopup] = useState(true);

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* 1. Tắt header mặc định của hệ thống để tránh bị lỗi lệch */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* 2. Tự chế thanh Header thủ công: Nút back bên trái, Tiêu đề căn giữa tuyệt đối */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Điều chỉnh thông báo tổng quát</Text>
        <View style={{ width: 24 }} /> {/* Khoảng trống cân bằng với nút back */}
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          {/* Mục 1: Bật thông báo */}
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.label}>Bật thông báo</Text>
              <Text style={styles.subLabel}>Nhận cảnh báo khi bé khóc</Text>
            </View>
            <Switch 
              value={isEnabled} 
              onValueChange={setIsEnabled} 
              trackColor={{ false: '#d1d1d6', true: '#ffb74d' }}
              thumbColor={'#fff'}
            />
          </View>

          <View style={styles.divider} />

          {/* Mục 2: Rung */}
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.label}>Rung</Text>
              <Text style={styles.subLabel}>Rung điện thoại khi có cảnh báo</Text>
            </View>
            <Switch 
              value={isVibrate} 
              onValueChange={setIsVibrate} 
              trackColor={{ false: '#d1d1d6', true: '#ffb74d' }}
              thumbColor={'#fff'}
            />
          </View>

          <View style={styles.divider} />

          {/* Mục 3: Thông báo Popup */}
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.label}>Thông báo Popup</Text>
              <Text style={styles.subLabel}>Hiển thị cửa sổ nổi cảnh báo ngay trên màn hình</Text>
            </View>
            <Switch 
              value={isPopup} 
              onValueChange={setIsPopup} 
              trackColor={{ false: '#d1d1d6', true: '#ffb74d' }}
              thumbColor={'#fff'}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f4f5f7' },
  // Thanh header tự chế bám sát đỉnh, chuẩn màu xanh, có nút back và chữ căn giữa tuyệt đối
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
  content: { padding: 16 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 18, 
    paddingHorizontal: 20 
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#21335b' 
  },
  subLabel: { 
    fontSize: 13, 
    color: '#666', 
    marginTop: 4 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#f0f0f0', 
    marginLeft: 20 
  }
});