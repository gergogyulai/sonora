import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View, Text, Image, ImageSourcePropType } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

type Props = PropsWithChildren<{
  headerImage?: ImageSourcePropType;
  headerTitle?: string;
  headerHeight?: number;
  contentContainerStyle?: any;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerTitle,
  headerHeight = 250,
  contentContainerStyle,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-headerHeight, 0, headerHeight], [2, 1, 1]),
        },
      ],
    };
  });

  const headerTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [0, headerHeight * 0.5, headerHeight],
        [1, 0.5, 0]
      ),
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, headerHeight],
            [0, headerHeight * 0.5]
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        contentContainerStyle={contentContainerStyle}>
        <Animated.View
          style={[
            styles.header,
            { height: headerHeight, backgroundColor: colors.background },
            headerAnimatedStyle,
          ]}>
          {headerImage && (
            <Image
              source={headerImage}
              style={styles.headerImage}
              resizeMode="cover"
            />
          )}
          {headerTitle && (
            <Animated.View style={[styles.headerTitleContainer, headerTextStyle]}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {headerTitle}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});
