import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform, Linking } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { logout, username, serverUrl } = useAuth();
  const router = useRouter();
  const [highQualityStreaming, setHighQualityStreaming] = useState(true);
  const [wifiOnlyDownloads, setWifiOnlyDownloads] = useState(true);
  const [crossfadeEnabled, setCrossfadeEnabled] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [equalizer, setEqualizer] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(false);
  const [cacheSize, setCacheSize] = useState("1.2 GB");

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

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached music and artwork. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Implement cache clearing logic
            setCacheSize("0 MB");
            Alert.alert('Cache Cleared', 'Your cache has been cleared successfully.');
          },
        },
      ],
    );
  };

  const navigateToScreen = (screen: string) => {
    // This would navigate to the appropriate screen when implemented
    Alert.alert('Coming Soon', `${screen} settings will be available in a future update.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? colors.background : '#fff' }]}>
      <Stack.Screen options={{ 
        title: 'Settings', 
        headerStyle: { backgroundColor: colorScheme === 'dark' ? colors.background : '#fff' }, 
        headerTintColor: colors.text 
      }} />
      
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
        
        {/* Playback Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Playback</Text>
          
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
                value={highQualityStreaming}
                onValueChange={setHighQualityStreaming}
                trackColor={{ false: '#767577', true: colors.tint }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="swap-horizontal" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Crossfade</Text>
                <Text style={[styles.settingDescription, { color: colors.icon }]}>Smooth transition between songs</Text>
              </View>
              <Switch
                value={crossfadeEnabled}
                onValueChange={setCrossfadeEnabled}
                trackColor={{ false: '#767577', true: colors.tint }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>            
          </View>
        </View>
        
        {/* Downloads and Storage Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Downloads & Storage</Text>
          
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? colors.cardBackground : '#f8f8f8' }]}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="download" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Download on Wi-Fi Only</Text>
                <Text style={[styles.settingDescription, { color: colors.icon }]}>Downloads will only use Wi-Fi</Text>
              </View>
              <Switch
                value={wifiOnlyDownloads}
                onValueChange={setWifiOnlyDownloads}
                trackColor={{ false: '#767577', true: colors.tint }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="save" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Data Saver</Text>
                <Text style={[styles.settingDescription, { color: colors.icon }]}>Reduce data usage when streaming</Text>
              </View>
              <Switch
                value={dataSaver}
                onValueChange={setDataSaver}
                trackColor={{ false: '#767577', true: colors.tint }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="folder" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Cache Size</Text>
                <Text style={[styles.settingValue, { color: colors.icon }]}>{cacheSize}</Text>
              </View>
              <TouchableOpacity onPress={handleClearCache}>
                <Text style={{ color: colors.tint, fontWeight: '500' }}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => navigateToScreen('Download Quality')}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="cloud-download" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Download Quality</Text>
                <Text style={[styles.settingValue, { color: colors.icon }]}>High</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Additional Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
          
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? colors.cardBackground : '#f8f8f8' }]}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="time" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Sleep Timer</Text>
                <Text style={[styles.settingDescription, { color: colors.icon }]}>Automatically stop playing after a period</Text>
              </View>
              <Switch
                value={sleepTimer}
                onValueChange={setSleepTimer}
                trackColor={{ false: '#767577', true: colors.tint }}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => navigateToScreen('Connected Devices')}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="bluetooth" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Connected Devices</Text>
                <Text style={[styles.settingDescription, { color: colors.icon }]}>Manage connected audio devices</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </TouchableOpacity>
            
            {Platform.OS === 'ios' && (
              <>
                <View style={styles.divider} />
                <TouchableOpacity 
                  style={styles.settingRow}
                  onPress={() => navigateToScreen('Apple Music')}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="musical-note" size={22} color={colors.tint} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Apple Music Integration</Text>
                    <Text style={[styles.settingDescription, { color: colors.icon }]}>Connect with Apple Music</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.icon} />
                </TouchableOpacity>
              </>
            )}
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
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => Alert.alert('Sonora', 'Thank you for using Sonora, the beautiful Jellyfin client.', [{ text: 'GitHub', onPress: () => {
                Linking.openURL('https://github.com/gergogyulai/sonora');
              } }, { text: 'Close', style: 'cancel' }])}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="heart" size={22} color={colors.tint} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>About Sonora</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </TouchableOpacity>
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