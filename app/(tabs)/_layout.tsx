import { Tabs } from 'expo-router';
import { Text, Platform } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E2E8F0',
        borderTopWidth: 1,
        height: Platform.OS === 'ios' ? 88 : 64,
        paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        paddingTop: 8,
      },
      tabBarActiveTintColor: '#0EA5E9',
      tabBarInactiveTintColor: '#94A3B8',
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    }}>
      <Tabs.Screen name="index" options={{ title: '首页', tabBarIcon: ({ focused }) => <TabIcon emoji={String.fromCodePoint(0x1F4CA)} focused={focused} /> }} />
      <Tabs.Screen name="trends" options={{ title: '趋势', tabBarIcon: ({ focused }) => <TabIcon emoji={String.fromCodePoint(0x1F4C8)} focused={focused} /> }} />
      <Tabs.Screen name="today-records" options={{ title: '记录', tabBarIcon: ({ focused }) => <TabIcon emoji={String.fromCodePoint(0x1F4DD)} focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ title: '设置', tabBarIcon: ({ focused }) => <TabIcon emoji={String.fromCodePoint(0x2699)} focused={focused} /> }} />
    </Tabs>
  );
}