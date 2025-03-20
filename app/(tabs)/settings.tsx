import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { logout, username, serverUrl } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to disconnect from your Jellyfin server?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('get-started' as any);
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? colors.background : '#fff' }]}>
      <Stack.Screen options={{ title: 'Settings', headerStyle: { backgroundColor: colorScheme === 'dark' ? colors.background : '#fff' }, headerTintColor: colors.text }} />
      
      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? colors.cardBackground : '#f8f8f8' }]}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Username</Text>
                <Text style={[styles.settingValue, { color: colors.icon }]}>{username}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="server" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Server</Text>
                <Text style={[styles.settingValue, { color: colors.icon }]}>{serverUrl}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f8f8f8' }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={22} color="#ff3b30" />
            <Text style={[styles.logoutText, { color: '#ff3b30' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
          
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? colors.cardBackground : '#f8f8f8' }]}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="musical-notes" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>High Quality Streaming</Text>
                <Text style={[styles.settingDescription, { color: colors.icon }]}>Stream music in the highest quality</Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: '#767577', true: colors.tint }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="download" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Download on Wi-Fi Only</Text>
                <Text style={[styles.settingDescription, { color: colors.icon }]}>Downloads will only use Wi-Fi</Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: '#767577', true: colors.tint }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </View>
        </View>
        
        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? colors.cardBackground : '#f8f8f8' }]}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="information-circle" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Version</Text>
                <Text style={[styles.settingValue, { color: colors.icon }]}>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    marginTop: 2,
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginLeft: 64,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 