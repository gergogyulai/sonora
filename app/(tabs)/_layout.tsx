import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme, Platform } from "react-native";
import { MusicPlayerProvider } from "../../context/MusicPlayerContext";
import { Colors } from "../../constants/Colors";
import { HapticTab } from "../../components/HapticTab";
import TabBarBackground from "../../components/ui/TabBarBackground";
import { SFSymbol } from "react-native-sfsymbols";
import { useAuth } from "../../context/AuthContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { isAuthenticated, serverUrl } = useAuth();
  console.log("serverUrl", serverUrl);
  console.log("isAuthenticated", isAuthenticated);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 90,
          },
          default: {},
        }),
        tabBarShowLabel: true,
        // tabBarStyle: {
        //   backgroundColor: isIOS ? 'transparent' : (colorScheme === "dark" ? colors.background : "#fff"),
        //   borderTopColor: "rgba(0, 0, 0, 0.1)",
        // },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            Platform.select({
              ios: <SFSymbol name="house.fill" size={24} color={color} />,
              default: <MaterialIcons name="home" size={24} color={color} />,
            })
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            Platform.select({
              ios: <SFSymbol name="music.note.list" size={24} color={color} />,
              default: <MaterialIcons name="library-music" size={24} color={color} />,
            })
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Browse",
          tabBarIcon: ({ color }) => (
            Platform.select({
              ios: <SFSymbol name="magnifyingglass" size={24} color={color} />,
              default: <MaterialIcons name="search" size={24} color={color} />,
            })
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            Platform.select({
              ios: <SFSymbol name="gearshape.fill" size={24} color={color} />,
              default: <MaterialIcons name="settings" size={24} color={color} />,
            })
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
    </Tabs>
  );
}
