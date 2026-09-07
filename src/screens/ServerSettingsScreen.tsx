import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

interface Props {
  host: string;
  port: string;
  onSave: (host: string, port: string) => void;
  onBack: () => void;
}

export default function ServerSettingsScreen({ host, port, onSave, onBack }: Props) {
  const [hostInput, setHostInput] = useState(host);
  const [portInput, setPortInput] = useState(port);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ server</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Mac server address</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 192.168.1.100"
          autoCapitalize="none"
          value={hostInput}
          onChangeText={setHostInput}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Port</Text>
        <TextInput style={styles.input} value={portInput} onChangeText={setPortInput} keyboardType="number-pad" />

        <TouchableOpacity style={styles.button} onPress={() => onSave(hostInput, portInput)}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
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
  content: { flex: 1, paddingHorizontal: 20 },
  label: { fontSize: 13, color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  button: { marginTop: 16, backgroundColor: '#111827', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});