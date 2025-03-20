import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search for songs, artists, albums...',
  isLoading = false,
}) => {
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleClear = () => {
    setSearchText('');
    onSearch('');
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    onSearch(searchText);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <Ionicons 
        name="search" 
        size={20} 
        color={colors.icon} 
        style={styles.searchIcon} 
      />
      
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.icon}
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />
      
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={colors.tint}
          style={styles.loadingIndicator}
        />
      ) : searchText.length > 0 ? (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={colors.icon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
}); 