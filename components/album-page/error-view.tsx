import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ErrorView({
  error,
  onRetry,
  colors,
}: {
  error: Error;
  onRetry: () => void;
  colors: any;
}) {
  return (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={colors.icon} />
      <Text style={[styles.errorText, { color: colors.text }]}>
        Error loading album: {error.message}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.tint }]}
        onPress={onRetry}
      >
        <Text style={styles.retryButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
