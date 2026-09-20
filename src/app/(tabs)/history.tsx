import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';
import { get, orderByChild, query, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebaseConfig';

export default function HistoryScreen() {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý chọn ngày lọc lịch sử (Mặc định là ngày hiện tại)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchHistoryData = async (date: Date) => {
    setLoading(true);
    try {
      const historyRef = ref(db, 'crying_history'); 
      const historyQuery = query(historyRef, orderByChild('time'));
      
      const snapshot = await get(historyQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Định dạng ngày được chọn sang chuỗi DD/MM/YYYY để khớp với định dạng "HH:mm:ss - DD/MM/YYYY" của ESP32
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const targetDateStr = `${day}/${month}/${year}`; // Ví dụ: "10/09/2026"

        // Lọc các bản ghi có chuỗi time khớp với ngày đang chọn
        const filtered = loadedData.filter((item) => {
          if (!item.time) return false;
          return item.time.includes(targetDateStr);
        });

        // 🌟 SẮP XẾP MỚI NHẤT LÊN ĐẦU
        filtered.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return b.id.localeCompare(a.id);
        });

        setHistoryList(filtered);
      } else {
        setHistoryList([]);
      }
    } catch (error) {
      console.log('Lỗi tải lịch sử:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData(selectedDate);
  }, [selectedDate]);

  // Xử lý khi chọn ngày trên lịch
  const onValueChangeDate = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const onDismissDatePicker = () => {
    setShowDatePicker(false);
  };

  // Format hiển thị ngày tháng trên nút bấm
  const formatDateString = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header tiêu đề */}
      <View style={styles.customHeader}>
        <Text style={styles.headerTitle}>Lịch sử tiếng khóc</Text>
      </View>

      {/* Thanh chọn ngày (DatePicker Trigger) */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#21335b" />
          <Text style={styles.datePickerText}>Ngày: {formatDateString(selectedDate)}</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onValueChangeDate}
          onDismiss={onDismissDatePicker}
          maximumDate={new Date()}
        />
      )}

      {/* Danh sách lịch sử báo động */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#21335b" />
            <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
          </View>
        ) : historyList.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Không có lịch sử tiếng khóc trong ngày này.</Text>
          </View>
        ) : (
          <FlatList
            data={historyList}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const timeString = item.time || 'Không xác định';
              return (
                <View style={styles.historyCard}>
                  <View style={styles.iconBox}>
                    <Ionicons name="warning" size={24} color="#ff9800" />
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.alertTitle}>Phát hiện bé quấy khóc</Text>
                    {/* Đã lược bỏ các đoạn mô tả thuật toán rườm rà, giữ giao diện gọn gàng */}
                    <Text style={styles.alertDesc}>Hệ thống ghi nhận âm thanh cảnh báo từ thiết bị.</Text>
                    <Text style={styles.alertTime}>Thời gian: {timeString}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f4f5f7' },
  customHeader: { 
    backgroundColor: '#21335b', 
    paddingVertical: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: '100%'
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  datePickerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#21335b',
    marginHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyText: {
    marginTop: 12,
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
  },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoBox: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#21335b',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  alertTime: {
    fontSize: 12,
    color: '#888',
  },
});