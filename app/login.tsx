import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { SFSymbol } from "react-native-sfsymbols";
export default function LoginScreen() {
  const [serverUrl, setServerUrl] = useState('http://192.168.1.54:30013');
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('123456789');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = async () => {
    if (!serverUrl || !username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Make sure server URL has protocol
    let normalizedUrl = serverUrl;
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    setIsLoading(true);
    try {
      const success = await login(normalizedUrl, username, password);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', 'Unable to connect to server or invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[
        styles.container, 
        { backgroundColor: colorScheme === 'dark' ? colors.background : '#fff' }
      ]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={50}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Ionicons 
            name="musical-notes" 
            size={60} 
            color={colors.tint} 
          />
          <Text style={[styles.title, { color: colors.text }]}>Connect to Jellyfin</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Enter your Jellyfin server details to access your music
          </Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={[
              styles.inputWrapper, 
              { backgroundColor: colorScheme === 'dark' ? colors.cardBackground : '#f5f5f5' }
            ]}>
              {Platform.select({
                ios: <SFSymbol name="globe" size={20} color={colors.icon} style={styles.inputIcon} />,
                default: <Ionicons name="globe-outline" size={20} color={colors.icon} style={styles.inputIcon} />,
              })}
              <TextInput
                placeholder="Server URL (e.g. https://jellyfin.example.com)"
                placeholderTextColor={colors.tabIconDefault}
                style={[styles.input, { color: colors.text }]}
                value={serverUrl}
                onChangeText={setServerUrl}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <View style={[
              styles.inputWrapper, 
              { backgroundColor: colorScheme === 'dark' ? colors.cardBackground : '#f5f5f5' }
            ]}>
              {Platform.select({
                ios: <SFSymbol name="person" size={20} color={colors.icon} style={styles.inputIcon} />,
                default: <Ionicons name="person-outline" size={20} color={colors.icon} style={styles.inputIcon} />,
              })}
              <TextInput
                placeholder="Username"
                placeholderTextColor={colors.tabIconDefault}
                style={[styles.input, { color: colors.text }]}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <View style={[
              styles.inputWrapper, 
              { backgroundColor: colorScheme === 'dark' ? colors.cardBackground : '#f5f5f5' }
            ]}>
              {Platform.select({
                ios: <SFSymbol name="lock" size={20} color={colors.icon} style={styles.inputIcon} />,
                default: <Ionicons name="lock-closed-outline" size={20} color={colors.icon} style={styles.inputIcon} />,
              })}
              <TextInput
                placeholder="Password"
                placeholderTextColor={colors.tabIconDefault}
                style={[styles.input, { color: colors.text }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color={colors.icon} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.buttonText}>Connect</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
  },
  inputIcon: {
    marginRight: 20,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: 28,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 