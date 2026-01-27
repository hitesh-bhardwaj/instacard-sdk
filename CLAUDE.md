# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native application built with Expo SDK 54, using Expo Router for file-based navigation. The app uses React 19.1.0, React Native 0.81.5, and TypeScript with strict mode enabled.

**Key Features:**
- React Compiler enabled (experimental)
- Typed routes enabled (experimental)
- React Native New Architecture enabled
- Supports iOS, Android, and Web platforms

## What We're Building

**Instacard** - A modern digital wallet application for managing virtual and physical cards. The app features a polished UI with smooth animations, similar to modern fintech applications.

**Core Screens:**
- Home Screen - Entry point with navigation to cards
- Cards Listing - Scrollable list of user's cards with filters
- Card Details - Individual card view with actions (coming soon)
- Card Management - Add, edit, and manage cards (coming soon)

**Design Assets:**
- Reference designs in `assets/images/screens/` (sc01.png, sc02.png)
- Card images in `assets/images/cards/` (5 Instacard variants)

## Development Philosophy

### Reusable Components
Always create reusable, composable components. Components should be:
- Single-responsibility focused
- Accept props for customization
- Use TypeScript interfaces for prop types
- Placed in `components/` directory, grouped by feature (e.g., `components/cards/`)

### Color System
Use the centralized color palette from `constants/colors.ts`:
```typescript
import { InstacardColors } from '@/constants/colors';

// Use semantic color names
backgroundColor: InstacardColors.primary,
color: InstacardColors.textOnPrimary,
```

### Animation Guidelines
This app is **animation-heavy** like modern mobile applications. Use **React Native Reanimated** for all animations:

- Use `useSharedValue` for animated values
- Use `useAnimatedStyle` for animated styles
- Use `withSpring`, `withTiming`, `withSequence` for animation curves
- Prefer `worklet` functions for performance
- Common animation patterns:
  - Card stack/carousel effects
  - Smooth page transitions
  - Micro-interactions (button presses, list items)
  - Gesture-driven animations (swipe, drag)

Example pattern:
```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

// Trigger animation
scale.value = withSpring(1.1);
```

### Best Practices
- Use `StyleSheet.create()` for styles (not inline styles)
- Extract magic numbers into constants
- Use `@/` path alias for imports
- Keep components under 200 lines; extract sub-components if larger
- Use `expo-haptics` for tactile feedback on interactions
- Handle loading and error states gracefully

## Development Commands

### Starting the Development Server

```bash
npm start              # Start Expo dev server with options menu
npm run android        # Start and open on Android emulator/device
npm run ios            # Start and open on iOS simulator/device
npm run web            # Start and open in web browser
```

### Other Commands

```bash
npm run lint           # Run ESLint
npm run reset-project  # Move current app/ to app-example/ for fresh start
```

### Testing on Physical Devices

For Android/iOS physical devices using Expo Go:
- Ensure both computer and device are on the same WiFi network
- If connection issues occur, try: `npx expo start --tunnel` (requires `@expo/ngrok` installed globally)

## Architecture

### File-Based Routing (Expo Router)

The app uses Expo Router v6 for navigation:

- **`app/_layout.tsx`**: Root layout with Stack navigator and theme provider
- **`app/(tabs)/_layout.tsx`**: Tab navigator layout with Home and Explore tabs
- **`app/(tabs)/index.tsx`**: Home screen (main entry point)
- **`app/(tabs)/explore.tsx`**: Explore screen
- **`app/cards.tsx`**: Cards listing screen (stack screen)
- **`app/modal.tsx`**: Modal screen example

Routes are automatically generated based on file structure in the `app/` directory. Groups are denoted by parentheses, e.g., `(tabs)`.

### Path Aliases

TypeScript is configured with `@/*` path alias pointing to the root directory:
```typescript
import { ThemedText } from '@/components/themed-text';
```

### Theming

- Theme configuration in `constants/theme.ts`
- `useColorScheme` hook for detecting light/dark mode (with platform-specific implementations)
- `useThemeColor` hook for theme-aware colors
- Themed components: `ThemedText`, `ThemedView` in `components/`

### Components Organization

- **`components/`**: Reusable UI components (themed components, haptic feedback, parallax scroll view)
- **`components/ui/`**: UI primitives and icon components
- **`components/cards/`**: Card-related components (CardItem, CardList, CardsHeader, FilterBar, GreetingBar)
- **`hooks/`**: Custom React hooks (color scheme, theme color)
- **`constants/`**: App-wide constants (theme colors, Instacard colors, card data)
- **`assets/`**: Images, fonts, and other static resources

### Navigation Features

- Bottom tab navigation with haptic feedback (`HapticTab` component)
- SF Symbols icons via `IconSymbol` component
- Stack navigation for modals
- Deep linking support (scheme: `instacardsdk`)

## Platform-Specific Notes

### Android
- Edge-to-edge display enabled
- Predictive back gesture disabled
- Adaptive icon with foreground, background, and monochrome images

### iOS
- Tablet support enabled

### Web
- Static output mode configured
- React Native Web for web compatibility
