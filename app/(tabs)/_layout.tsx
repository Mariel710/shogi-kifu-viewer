import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5D4037',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#FAFAF5',
          borderTopColor: '#DEB887',
        },
        headerStyle: {
          backgroundColor: '#5D4037',
        },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '棋譜再生',
          tabBarLabel: '棋譜再生',
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'ライブラリ',
          tabBarLabel: 'ライブラリ',
        }}
      />
    </Tabs>
  );
}
