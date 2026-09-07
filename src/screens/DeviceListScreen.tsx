import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';

interface Device {
  deviceId: string;
  connected: boolean;
  lastSeen: number | null;
}

interface Props {
  host: string;
  port: string;
  onBack: () => void;
}

export default function DeviceListScreen({ host, port, onBack }: Props) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!host) return;
    try {
      const response = await fetch(`http://${host}:${port}/api/devices`);
      const data = await response.json();
      setDevices(data);
    } catch {
      // lỗi mạng thì cứ giữ nguyên danh sách cũ, không xóa trắng
    }
  }, [host, port]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách thiết bị</Text>
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.deviceId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={devices.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có thiết bị nào kết nối tới server</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.bellCircle, { backgroundColor: item.connected ? '#DBEAFE' : '#E5E7EB' }]}>
              <Text style={styles.bellIcon}>🔔</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.deviceName}>{item.deviceId}</Text>
              <Text style={[styles.statusText, { color: item.connected ? '#16A34A' : '#9CA3AF' }]}>
                {item.connected ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 12, paddingBottom: 16 },
  backButton: { padding: 8 },
  backArrow: { fontSize: 22, color: '#111827' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 4 },
  list: { paddingHorizontal: 20 },
  emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#6B7280', textAlign: 'center', paddingHorizontal: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  bellCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  bellIcon: { fontSize: 20 },
  cardInfo: { flex: 1 },
  deviceName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  statusText: { fontSize: 13, marginTop: 2 },
});