import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, SectionList, TouchableOpacity } from 'react-native';

interface SoundEvent {
  id: number;
  deviceId: string;
  eventType: string;
  level: number;
  ts: number;
}

interface Section {
  title: string;
  data: SoundEvent[];
}

interface Props {
  host: string;
  port: string;
}

const EVENT_LABELS: Record<string, string> = {
  cry_start: 'Phát hiện tiếng khóc',
  sudden_noise: 'Phát hiện tiếng động lớn',
  cry_end: 'Hết tiếng khóc',
};

const EVENT_COLORS: Record<string, string> = {
  cry_start: '#DC2626',
  sudden_noise: '#EA580C',
  cry_end: '#6B7280',
};

function isToday(ts: number) {
  const date = new Date(ts);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function formatDateHeader(ts: number) {
  const date = new Date(ts);
  const dateStr = date.toLocaleDateString('vi-VN');
  return isToday(ts) ? `Hôm nay - ${dateStr}` : dateStr;
}

function groupByDate(events: SoundEvent[]): Section[] {
  const groups: Record<string, SoundEvent[]> = {};

  for (const event of events) {
    const key = formatDateHeader(event.ts);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(event);
  }

  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

export default function HistoryScreen({ host, port }: Props) {
  const [events, setEvents] = useState<SoundEvent[]>([]);
  const [todayOnly, setTodayOnly] = useState(false);

  const load = useCallback(async () => {
    if (!host) return;
    try {
      const response = await fetch(`http://${host}:${port}/api/events?limit=100`);
      const data = await response.json();
      setEvents(data);
    } catch {
      // lỗi mạng thì giữ nguyên danh sách cũ, không xóa trắng
    }
  }, [host, port]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleEvents = todayOnly ? events.filter((e) => isToday(e.ts)) : events;
  const sections = groupByDate(visibleEvents);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử tiếng khóc</Text>
      </View>

      <SectionList
        style={styles.list}
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={sections.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có sự kiện nào</Text>}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: EVENT_COLORS[item.eventType] ?? '#9CA3AF' }]} />
            <View style={styles.rowInfo}>
              <Text style={styles.rowTime}>
                {new Date(item.ts).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </Text>
              <Text style={styles.rowTitle}>
                {EVENT_LABELS[item.eventType] ?? item.eventType} - {item.deviceId}
              </Text>
              <Text style={styles.rowMeta}>Âm lượng: {item.level} dB</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.filterButton, todayOnly && styles.filterButtonActive]}
          onPress={() => setTodayOnly(!todayOnly)}
        >
          <Text style={[styles.filterButtonText, todayOnly && styles.filterButtonTextActive]}>Hôm nay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  list: { flex: 1, paddingHorizontal: 20 },
  emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#6B7280' },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
  },
  row: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, marginRight: 12 },
  rowInfo: { flex: 1 },
  rowTime: { fontSize: 12, color: '#9CA3AF' },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginTop: 2 },
  rowMeta: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  footer: { paddingVertical: 16, alignItems: 'center' },
  filterButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#111827',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  filterButtonActive: { backgroundColor: '#111827' },
  filterButtonText: { color: '#111827', fontWeight: '700' },
  filterButtonTextActive: { color: '#fff' },
});