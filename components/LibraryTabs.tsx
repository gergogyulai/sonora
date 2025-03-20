import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Animated 
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

interface LibraryTabsProps {
  tabs: string[];
  onChangeTab: (index: number) => void;
  initialTab?: number;
}

export const LibraryTabs: React.FC<LibraryTabsProps> = ({ 
  tabs, 
  onChangeTab, 
  initialTab = 0 
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const handlePress = (index: number) => {
    setActiveTab(index);
    onChangeTab(index);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === index && [
                styles.activeTab,
                { backgroundColor: colors.tint }
              ]
            ]}
            onPress={() => handlePress(index)}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === index
                  ? [styles.activeTabText, { color: '#fff' }]
                  : { color: colors.text }
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  tabsContainer: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
  },
}); 