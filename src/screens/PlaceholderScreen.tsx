import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  onBack: () => void;
}

export default function PlaceholderScreen({ title, onBack }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.emoji}>🚧</Text>
        <Text style={styles.message}>Tính năng "{title}" chưa được xây dựng.</Text>
        <Text style={styles.subMessage}>Đây là giao diện demo, chưa có chức năng thật đằng sau.</Text>
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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emoji: { fontSize: 40, marginBottom: 16 },
  message: { fontSize: 16, fontWeight: '600', color: '#111827', textAlign: 'center' },
  subMessage: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 8 },
});