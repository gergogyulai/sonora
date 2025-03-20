import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../lib/store';
import { useMusic, useAddMusic } from '../lib/hooks/useMusic';

export function ExampleComponent() {
  // Use Zustand store
  const { user, login, logout } = useAppStore();
  
  // Use TanStack Query
  const { data: musicData, isLoading, error } = useMusic();
  const addMusicMutation = useAddMusic();

  // Sample login function
  const handleLogin = () => {
    login('user123', 'JohnDoe');
  };

  // Sample add music function
  const handleAddMusic = () => {
    addMusicMutation.mutate({ title: 'New Song', artist: 'New Artist' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zustand + TanStack Query Example</Text>
      
      {/* Zustand State */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zustand State:</Text>
        <Text>User logged in: {user.isLoggedIn ? 'Yes' : 'No'}</Text>
        {user.isLoggedIn && (
          <>
            <Text>Username: {user.username}</Text>
            <Text>User ID: {user.userId}</Text>
          </>
        )}
        
        <View style={styles.buttonContainer}>
          {!user.isLoggedIn ? (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* TanStack Query Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TanStack Query Data:</Text>
        {isLoading ? (
          <Text>Loading music data...</Text>
        ) : error ? (
          <Text>Error loading data: {error.message}</Text>
        ) : (
          <>
            <Text>Music data loaded successfully</Text>
            <TouchableOpacity style={styles.button} onPress={handleAddMusic} disabled={addMusicMutation.isPending}>
              <Text style={styles.buttonText}>
                {addMusicMutation.isPending ? 'Adding...' : 'Add New Music'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 12,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#cf6679',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 