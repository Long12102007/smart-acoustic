import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useFocusEffect } from 'expo-router';
import * as Speech from 'expo-speech'; // Dùng Speech hoặc cơ chế an toàn không lỗi native module
import { onValue, ref } from 'firebase/database';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function HomeScreen() {
  const [babyStatus, setBabyStatus] = useState('YÊN BÌNH');
  const [statusMessage, setStatusMessage] = useState('Bé đang ngủ ngoan');
  const [nodeCount, setNodeCount] = useState(1);
  const [historyCount, setHistoryCount] = useState(0);
  const [displayName, setDisplayName] = useState('Chiến');

  // Hàm phát thông báo cảnh báo khi bé khóc
  const playAlertNotification = async () => {
    try {
      const savedRingtone = await AsyncStorage.getItem('selected_ringtone');
      let alertText = "Cảnh báo khẩn cấp! Bé đang khóc!";

      if (savedRingtone === 'Tiếng trẻ con khóc ré') {
        alertText = "Cảnh báo! Bé đang khóc ré lên kìa!";
      } else if (savedRingtone === 'Chuông báo nhẹ nhàng') {
        alertText = "Nhắc nhở: Bé đang khóc, mẹ kiểm tra nhé.";
      } else if (savedRingtone === 'Chuông điện tử chói tai') {
        alertText = "Báo động! Phát hiện tiếng khóc!";
      }

      // Phát âm thanh giọng nói cảnh báo rõ ràng, không lo lỗi native module
      Speech.speak(alertText, {
        language: 'vi-VN',
        pitch: 1.0,
        rate: 1.0,
      });
    } catch (error) {
      console.log('Lỗi phát âm thanh:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser) {
        const name = auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Chiến';
        setDisplayName(name);
      }
    }, [])
  );

  // Lắng nghe trạng thái bé từ Firebase
  useEffect(() => {
    const statusRef = ref(db, 'system_status/baby_state');
    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        const state = snapshot.val(); 
        
        // Khi phát hiện bé khóc -> Kích hoạt cảnh báo
        if (state === 'ĐANG KHÓC!' && babyStatus !== 'ĐANG KHÓC!') {
          playAlertNotification();
        }

        setBabyStatus(state);
        if (state === 'ĐANG KHÓC!') {
          setStatusMessage('Bé đang khóc, cần kiểm tra ngay!');
        } else {
          setStatusMessage('Bé đang ngủ ngoan');
        }
      }
    });

    return () => unsubscribeStatus();
  }, [babyStatus]);

  // Lắng nghe số lượng lịch sử hôm nay
  useEffect(() => {
    const historyRef = ref(db, 'crying_history');
    const unsubscribeHistory = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const todayStr = `${day}/${month}/${year}`; 

        const todayItems = loadedData.filter((item) => {
          if (!item.time) return false;
          return item.time.includes(todayStr);
        });

        setHistoryCount(todayItems.length);
      } else {
        setHistoryCount(0);
      }
    });

    return () => unsubscribeHistory();
  }, []);

  const isCrying = babyStatus === 'ĐANG KHÓC!';

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.customHeader}>
        <Text style={styles.headerTitle}>Trang Chủ</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.greeting}>Hello, {displayName}!</Text>
        
        <View style={[styles.statusCard, { borderColor: isCrying ? '#e53935' : '#81c784' }]}>
          <View>
            <Text style={styles.label}>Trạng Thái Bé:</Text>
            <Text style={[styles.statusValue, { color: isCrying ? '#e53935' : '#388e3c' }]}>
              {babyStatus}
            </Text>
            <Text style={styles.subText}>{statusMessage}</Text>
          </View>
          <Ionicons name={isCrying ? "alert-circle" : "happy"} size={60} color={isCrying ? "#e53935" : "#ffb74d"} />
        </View>

        <View style={styles.row}>
          <View style={styles.box}>
            <Ionicons name="radio" size={32} color="#21335b" />
            <Text style={styles.boxNumber}>{nodeCount}</Text>
            <Text style={styles.boxLabel}>Node Báo</Text>
          </View>
          <View style={styles.box}>
            <Ionicons name="notifications" size={32} color="#21335b" />
            <Text style={styles.boxNumber}>{historyCount}</Text>
            <Text style={styles.boxLabel}>Lịch Sử Hôm Nay</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f4f5f7' },
  customHeader: { 
    backgroundColor: '#21335b', 
    paddingTop: 50, 
    paddingBottom: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: '100%'
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center'
  },
  container: { flex: 1, padding: 20 },
  greeting: { fontSize: 26, fontWeight: 'bold', color: '#21335b', marginBottom: 20 },
  statusCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 2, marginBottom: 20, elevation: 2 },
  label: { fontSize: 16, color: '#777' },
  statusValue: { fontSize: 26, fontWeight: 'bold', marginVertical: 4 },
  subText: { fontSize: 14, color: '#888' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  box: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 25, alignItems: 'center', marginHorizontal: 6, elevation: 2 },
  boxNumber: { fontSize: 24, fontWeight: 'bold', color: '#21335b', marginVertical: 8 },
  boxLabel: { fontSize: 14, color: '#666' }
});