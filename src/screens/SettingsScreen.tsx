import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

interface MenuRow {
  icon: string;
  label: string;
  onPress: () => void;
}

interface MenuSection {
  icon: string;
  title: string;
  rows: MenuRow[];
}

interface Props {
  onOpenServer: () => void;
  onOpenNotifications: () => void;
  onOpenPlaceholder: (title: string) => void;
}

export default function SettingsScreen({ onOpenServer, onOpenNotifications, onOpenPlaceholder }: Props) {
  const sections: MenuSection[] = [
    {
      icon: '👤',
      title: 'TÀI KHOẢN',
      rows: [
        { icon: '✏️', label: 'Đổi tên đăng nhập', onPress: () => onOpenPlaceholder('Đổi tên đăng nhập') },
        { icon: '🔒', label: 'Đổi mật khẩu', onPress: () => onOpenPlaceholder('Đổi mật khẩu') },
      ],
    },
    {
      icon: '🔔',
      title: 'THÔNG BÁO CHUNG',
      rows: [
        { icon: '⚙️', label: 'Điều chỉnh thông báo tổng quát', onPress: onOpenNotifications },
        { icon: '🎵', label: 'Nhạc chuông báo động', onPress: () => onOpenPlaceholder('Nhạc chuông báo động') },
      ],
    },
    {
      icon: '🌐',
      title: 'KẾT NỐI',
      rows: [{ icon: '🖥️', label: 'Địa chỉ server', onPress: onOpenServer }],
    },
    {
      icon: '❓',
      title: 'TRỢ GIÚP',
      rows: [
        { icon: '📄', label: 'Tài liệu hướng dẫn', onPress: () => onOpenPlaceholder('Tài liệu hướng dẫn') },
        { icon: '📞', label: 'Liên hệ hỗ trợ', onPress: () => onOpenPlaceholder('Liên hệ hỗ trợ') },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cài đặt thiết bị</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{section.icon}</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            <View style={styles.card}>
              {section.rows.map((row, index) => (
                <TouchableOpacity
                  key={row.label}
                  style={[styles.row, index < section.rows.length - 1 && styles.rowDivider]}
                  onPress={row.onPress}
                >
                  <Text style={styles.rowIcon}>{row.icon}</Text>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  section: { marginTop: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionIcon: { fontSize: 16, marginRight: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  rowIcon: { fontSize: 18, marginRight: 12 },
  rowLabel: { flex: 1, fontSize: 15, color: '#111827' },
  rowArrow: { fontSize: 18, color: '#D1D5DB' },
});