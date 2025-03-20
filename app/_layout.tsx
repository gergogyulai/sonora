import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View, ActivityIndicator } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { Colors } from '../constants/Colors';
import { QueryProvider } from '../lib/queryClient';
import { MusicPlayerProvider } from '../context/MusicPlayerContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading, isFirstLaunch } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? colors.background : '#fff' }}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        // Show main app when authenticated
        <>
          <Stack.Screen 
            name="(tabs)" 
            options={{
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="album/[id]" 
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
              headerShown: false,
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }} 
          />
        </>
      ) : (
        // When not authenticated, show get-started by default
        // This handles both first launch and logout cases
        <Stack.Screen 
          name="get-started" 
          options={{ gestureEnabled: false }} 
        />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <MusicPlayerProvider>
            <RootLayoutNav />
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </MusicPlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
