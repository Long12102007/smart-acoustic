import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useAcousticSocket, SoundEvent } from '../hooks/useAcousticSocket';

const NOTIFICATIONS_KEY = 'notifications-enabled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const EVENT_TITLES: Record<string, string> = {
  cry_start: 'Phát hiện tiếng khóc',
  sudden_noise: 'Phát hiện tiếng động lớn',
};

interface Props {
  host: string;
  port: string;
  onViewHistory: () => void;
  onViewDevices: () => void;
}

export default function HomeScreen({ host, port, onViewHistory, onViewDevices }: Props) {
  const { lastEvent } = useAcousticSocket(host, port);
  const [onlineCount, setOnlineCount] = useState(0);
  const status = getStatus(lastEvent);

  const loadDeviceCount = useCallback(async () => {
    if (!host) return;
    try {
      const response = await fetch(`http://${host}:${port}/api/devices`);
      const data = await response.json();
      setOnlineCount(data.filter((d: { connected: boolean }) => d.connected).length);
    } catch {
      // bỏ qua, giữ số cũ
    }
  }, [host, port]);

  useEffect(() => {
    loadDeviceCount();
  }, [loadDeviceCount, lastEvent]);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    if (!lastEvent) return;
    const title = EVENT_TITLES[lastEvent.eventType];
    if (!title) return;

    AsyncStorage.getItem(NOTIFICATIONS_KEY).then((value) => {
      if (value === 'false') return;
      Notifications.scheduleNotificationAsync({
        content: { title, body: `${lastEvent.level} dB` },
        trigger: null,
      });
    });
  }, [lastEvent]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trang Chủ</Text>
        <TouchableOpacity onPress={onViewDevices} style={styles.headerButton}>
          <Text style={styles.headerButtonIcon}>▦</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.greeting}>Hello, Parent! 👋</Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Trạng Thái Bé:</Text>
          <Text style={[styles.statusValue, { color: status.color }]}>{status.label}</Text>
          <Text style={styles.statusTime}>
            {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.statBox} onPress={onViewDevices}>
            <Text style={styles.statNumber}>{onlineCount}</Text>
            <Text style={styles.statLabel}>Node Báo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.historyButton} onPress={onViewHistory}>
            <Text style={styles.historyButtonText}>Lịch Sử{'\n'}Mới Nhất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function getStatus(lastEvent: SoundEvent | null) {
  if (lastEvent?.eventType === 'cry_start') {
    return { label: 'PHÁT HIỆN TIẾNG KHÓC', color: '#DC2626' };
  }
  if (lastEvent?.eventType === 'sudden_noise') {
    return { label: 'CÓ TIẾNG ĐỘNG LỚN', color: '#EA580C' };
  }
  return { label: 'YÊN BÌNH', color: '#16A34A' };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#111827' },
  headerButton: { padding: 6 },
  headerButtonIcon: { fontSize: 20, color: '#111827' },
  content: { flex: 1, paddingHorizontal: 20 },
  greeting: { fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 16 },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusLabel: { fontSize: 14, color: '#6B7280' },
  statusValue: { fontSize: 28, fontWeight: '800', marginTop: 6 },
  statusTime: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  historyButton: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyButtonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});