import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Giả lập hoặc thực hiện việc khởi tạo tài nguyên, kiểm tra kết nối tại đây
    const prepareApp = async () => {
      try {
        // Nếu có init Firebase hoặc tải dữ liệu cục bộ, hãy đặt ở đây
        await new Promise(resolve => setTimeout(resolve, 500)); // Chờ nhẹ 0.5s để native module ổn định
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    };

    prepareApp();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
