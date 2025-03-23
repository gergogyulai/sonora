/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Colors inspired by Apple Music's aesthetic for our music streaming app.
 */

const tintColorLight = '#ff2d55'; // Apple Music pink accent
const tintColorDark = '#ff375f'; // Apple Music dark mode pink accent

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#888888',
    tabIconSelected: tintColorLight,
    playerBackground: '#ffffff',
    playerControlsBackground: '#f8f8f8',
    playerText: '#000000',
    cardBackground: '#f8f8f8',
    trackProgress: '#ff2d55',
    trackBackground: '#e7e7e7',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    tint: tintColorDark,
    icon: '#b3b3b3',
    tabIconDefault: '#8e8e8e',
    tabIconSelected: tintColorDark,
    playerBackground: '#1c1c1c',
    playerControlsBackground: '#2c2c2c',
    playerText: '#ffffff',
    cardBackground: '#2c2c2c',
    trackProgress: '#ff375f',
    trackBackground: '#424242',
  },
};
