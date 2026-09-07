import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import DeviceListScreen from './src/screens/DeviceListScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ServerSettingsScreen from './src/screens/ServerSettingsScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';

type Tab = 'home' | 'history' | 'settings';
type HomeView = 'main' | 'devices';
type SettingsView = 'main' | 'server' | 'notifications' | 'placeholder';

const HOST_KEY = 'server-host';
const PORT_KEY = 'server-port';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [homeView, setHomeView] = useState<HomeView>('main');
  const [settingsView, setSettingsView] = useState<SettingsView>('main');
  const [placeholderTitle, setPlaceholderTitle] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('8080');

  useEffect(() => {
    const load = async () => {
      const storedHost = await AsyncStorage.getItem(HOST_KEY);
      const storedPort = await AsyncStorage.getItem(PORT_KEY);
      if (storedHost) setHost(storedHost);
      if (storedPort) setPort(storedPort);
    };
    load();
  }, []);

  const goToTab = (newTab: Tab) => {
    setTab(newTab);
    setHomeView('main');
    setSettingsView('main');
  };

  const handleSave = async (newHost: string, newPort: string) => {
    setHost(newHost);
    setPort(newPort);
    await AsyncStorage.setItem(HOST_KEY, newHost);
    await AsyncStorage.setItem(PORT_KEY, newPort);
    setSettingsView('main');
  };

  const openPlaceholder = (title: string) => {
    setPlaceholderTitle(title);
    setSettingsView('placeholder');
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {tab === 'home' && homeView === 'main' && (
          <HomeScreen
            host={host}
            port={port}
            onViewHistory={() => goToTab('history')}
            onViewDevices={() => setHomeView('devices')}
          />
        )}
        {tab === 'home' && homeView === 'devices' && (
          <DeviceListScreen host={host} port={port} onBack={() => setHomeView('main')} />
        )}

        {tab === 'history' && <HistoryScreen host={host} port={port} />}

        {tab === 'settings' && settingsView === 'main' && (
          <SettingsScreen
            onOpenServer={() => setSettingsView('server')}
            onOpenNotifications={() => setSettingsView('notifications')}
            onOpenPlaceholder={openPlaceholder}
          />
        )}
        {tab === 'settings' && settingsView === 'server' && (
          <ServerSettingsScreen host={host} port={port} onSave={handleSave} onBack={() => setSettingsView('main')} />
        )}
        {tab === 'settings' && settingsView === 'notifications' && (
          <NotificationSettingsScreen onBack={() => setSettingsView('main')} />
        )}
        {tab === 'settings' && settingsView === 'placeholder' && (
          <PlaceholderScreen title={placeholderTitle} onBack={() => setSettingsView('main')} />
        )}
      </View>

      <View style={styles.tabBar}>
        <TabButton label="Trang Chủ" active={tab === 'home'} onPress={() => goToTab('home')} />
        <TabButton label="Lịch Sử" active={tab === 'history'} onPress={() => goToTab('history')} />
        <TabButton label="Cài đặt" active={tab === 'settings'} onPress={() => goToTab('settings')} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
      <Text style={active ? styles.tabLabelActive : styles.tabLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 30,
    paddingTop: 12,
  },
  tabButton: { flex: 1, alignItems: 'center' },
  tabLabel: { fontSize: 13, color: '#9CA3AF' },
  tabLabelActive: { fontSize: 13, color: '#111827', fontWeight: '700' },
});