import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY = 'notifications-enabled';

interface Props {
  onBack: () => void;
}

export default function NotificationSettingsScreen({ onBack }: Props) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(NOTIFICATIONS_KEY).then((value) => {
      if (value !== null) setEnabled(value === 'true');
    });
  }, []);

  const toggle = async (value: boolean) => {
    setEnabled(value);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, String(value));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Điều chỉnh thông báo</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>Thông báo cảnh báo</Text>
          <Text style={styles.rowSubtitle}>Nhận thông báo khi phát hiện tiếng khóc hoặc tiếng động lớn</Text>
        </View>
        <Switch value={enabled} onValueChange={toggle} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 12, paddingBottom: 16 },
  backButton: { padding: 8 },
  backArrow: { fontSize: 22, color: '#111827' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowText: { flex: 1, marginRight: 12 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  rowSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },
});