import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { MusicPlayerProvider } from '../../context/MusicPlayerContext';
import { Colors } from '../../constants/Colors';
import { HapticTab } from '../../components/HapticTab';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <MusicPlayerProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.tabIconDefault,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? colors.background : '#fff',
            borderTopColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'For You',
            tabBarIcon: ({ color }) => <Ionicons name="play-circle" size={24} color={color} />,
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color }) => <Ionicons name="library" size={24} color={color} />,
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Browse',
            tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
      </Tabs>
    </MusicPlayerProvider>
  );
}
