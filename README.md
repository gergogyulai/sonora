# Sonora
![sonora-gh-reame-header-tiny](https://github.com/user-attachments/assets/202d6c40-9fe0-49f2-a643-b25340b87603)

Sleek and modern music streaming app, powered by Jellyfin, built with Expo and React Native.

## About Sonora
Sonora is a project aimed at delivering a high-quality selfhosted music streaming experience. The goal is to take inspiration from Apple Music’s design—keeping the good parts and rethinking the bad ones—to create a seamless and beautiful user interface. Built with React Native and Expo, Sonora will allow users to stream their personal music library from a Jellyfin server.

As this is an early-stage project, the codebase is subject to frequent changes and improvements.

## Features (Planned & In Progress)
- Stream music from your Jellyfin server
- Elegant and modern UI inspired by Apple Music
- Cross-platform support with React Native & Expo
- Smart search and dynamic filtering
- Light & dark mode support
- Offline playback (planned)
- Gapless playback (planned)

## Development

### Prerequisites
To set up the development environment, ensure you have the following installed:
- **Bun** or **Node.js** with npm/yarn
- **A Jellyfin server** set up and running
- **Xcode** (for iOS development) or the appropriate **Android toolchain** (Android Studio, Java JDK, etc.)

### Clone the Repository
```sh
git clone https://github.com/gergogyulai/sonora.git
cd sonora
```

### Install Dependencies
```sh
bun install
# or
npm install
# or
yarn install
```

### Running the App
Since Sonora uses native modules, **Expo Go will not work** for development. Instead, developers need to use a custom development client:

1. **Build the development client**
   ```sh
   expo prebuild
   expo run:ios  # for iOS (requires macOS and Xcode)
   expo run:android  # for Android
   ```
2. **Start the development server**
   ```sh
   expo start
   ```
3. **Run on a simulator/emulator or a physical device**
   - For iOS, open the project in Xcode and run it on a simulator.
   - For Android, use an emulator from Android Studio or connect a physical device via USB.

## Configuration
Before using Sonora, ensure you have a Jellyfin server set up. You can configure your server details inside the app settings.

## The stack
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jellyfin API SDK](https://github.com/jellyfin/jellyfin-sdk-typescript)
- [Tanstack Query](https://tanstack.com/query/latest)
- [react-native-track-player](https://github.com/doublesymmetry/react-native-track-player)

## Contributing
Contributions are welcome! Feel free to open issues and pull requests.

## License
MIT License. See [`LICENSE`](LICENSE) for details.
