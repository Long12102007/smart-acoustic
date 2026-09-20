import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#21335b', headerStyle: { backgroundColor: '#21335b' }, headerTintColor: '#fff' }}>
      <Tabs.Screen name="home" options={{ title: 'Trang Chủ', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="devices" options={{ title: 'Thiết bị', tabBarIcon: ({ color, size }) => <Ionicons name="hardware-chip" size={size} color={color} /> }} />
      <Tabs.Screen name="history" options={{ title: 'Lịch Sử', tabBarIcon: ({ color, size }) => <Ionicons name="time" size={size} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Cài Đặt', tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} /> }} />
    </Tabs>
  );
}