import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebaseConfig';

export default function DevicesScreen() {
  const [devices, setDevices] = useState<any[]>([]);
  const [rawFirebaseData, setRawFirebaseData] = useState<any>(null);

  // 1. Lắng nghe dữ liệu từ Firebase một lần duy nhất khi vào màn hình
  useEffect(() => {
    const devicesRef = ref(db, 'devices');
    const unsubscribe = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        setRawFirebaseData(snapshot.val());
      } else {
        setRawFirebaseData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Chạy vòng lặp kiểm tra thời gian thực mỗi giây để tự động cập nhật trạng thái On/Off
  useEffect(() => {
    const timer = setInterval(() => {
      if (rawFirebaseData) {
        const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
        
        const loadedDevices = Object.keys(rawFirebaseData).map((key) => {
          const device = rawFirebaseData[key];
          const lastSeenTime = device.lastSeen || 0;
          
          // Kiểm tra: Nếu quá 8 giây không nhận được tín hiệu heartbeat từ ESP32 -> Tự động chuyển thành Offline
          const isReallyOnline = device.status === 'Online' && (currentTime - lastSeenTime <= 8);

          return {
            id: key,
            ...device,
            computedStatus: isReallyOnline ? 'Online' : 'Offline'
          };
        });

        setDevices(loadedDevices);
      } else {
        setDevices([]);
      }
    }, 1000); // Quét lại mỗi 1 giây

    return () => clearInterval(timer);
  }, [rawFirebaseData]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách thiết bị</Text>
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const isOnline = item.computedStatus === 'Online';
          
          return (
            <View style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: isOnline ? '#e8f5e9' : '#ffebee' }]}>
                <Ionicons 
                  name={isOnline ? "radio" : "power"} 
                  size={24} 
                  color={isOnline ? "#4caf50" : "#e53935"} 
                />
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.deviceName}>{item.name || item.id}</Text>
                <Text style={styles.nodeId}>{item.id.toUpperCase()}</Text>
              </View>
              <Text style={[styles.statusText, { color: isOnline ? '#4caf50' : '#e53935' }]}>
                {isOnline ? 'Đang Bật' : 'Offline'}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f5f7' },
  header: { backgroundColor: '#21335b', paddingVertical: 16, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, alignItems: 'center', elevation: 2 },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  infoBox: { flex: 1 },
  deviceName: { fontSize: 16, fontWeight: 'bold', color: '#21335b', marginBottom: 4 },
  nodeId: { fontSize: 12, color: '#888', marginBottom: 2 },
  statusText: { fontSize: 14, fontWeight: 'bold' }
});