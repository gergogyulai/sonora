import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ColorSchemeName } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function GetStartedScreen() {
  const router = useRouter();
  const { setFirstLaunchComplete } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleGetStarted = async () => {
    await setFirstLaunchComplete();
    router.replace('login' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <LinearGradient
        colors={colorScheme === 'dark' 
          ? ['#121212', '#2c2c2c'] 
          : ['#ffffff', '#f8f8f8']}
        style={styles.gradient}
      />
      
      <View style={styles.header}>
        <Ionicons 
          name="musical-notes" 
          size={80} 
          color={colors.tint} 
        />
        <Text style={[styles.title, { color: colors.text }]}>Sonora</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Your personal music streaming experience
        </Text>
      </View>
      
      <View style={styles.features}>
        <FeatureItem 
          icon="play-circle" 
          title="Stream Your Music" 
          description="Connect to your Jellyfin server and access your entire music collection"
          colorScheme={colorScheme}
          colors={colors}
        />
        <FeatureItem 
          icon="library" 
          title="Organize Your Library" 
          description="Browse by artists, albums, playlists and more"
          colorScheme={colorScheme}
          colors={colors}
        />
        <FeatureItem 
          icon="musical-notes" 
          title="Enjoy High Quality Audio" 
          description="Experience your music in the highest quality available"
          colorScheme={colorScheme}
          colors={colors}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

type FeatureItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  colorScheme: ColorSchemeName;
  colors: any;
};

const FeatureItem = ({ icon, title, description, colorScheme, colors }: FeatureItemProps) => {
  return (
    <View style={styles.featureItem}>
      <View style={[
        styles.iconContainer, 
        { backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f0f0f0' }
      ]}>
        <Ionicons name={icon} size={24} color={colors.tint} />
      </View>
      <View style={styles.featureText}>
        <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.featureDescription, { color: colors.icon }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 28,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: width * 0.8,
  },
  features: {
    width: '100%',
    marginBottom: 60,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    borderRadius: 30,
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 