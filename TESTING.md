# Testing Guide for Instacard SDK

This document outlines the testing strategies and options available for our React Native/Expo frontend project.

## Current Status

The project currently has **no testing setup configured**. This guide provides a roadmap for implementing comprehensive testing.

---

## 1. Unit & Component Tests (Recommended First)

### What to Test
- Individual components (`CardItem`, `FilterBar`, `GreetingBar`, etc.)
- Custom hooks (`useColorScheme`, `useThemeColor`)
- Utility functions in `constants/`
- Component logic and rendering

### Setup

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

### Example Test Structure

```typescript
// components/cards/__tests__/CardItem.test.tsx
import { render } from '@testing-library/react-native';
import { CardItem } from '../CardItem';

test('renders card with correct title', () => {
  const { getByText } = render(<CardItem title="Test Card" />);
  expect(getByText('Test Card')).toBeTruthy();
});
```

### Package Scripts to Add

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 2. Integration Tests

### What to Test
- Screen-level interactions (Cards listing with filters)
- Navigation flows (Home → Cards screen)
- State management across components
- Animation triggers and interactions

### Setup
Uses same setup as unit tests but tests multiple components together.

### Example

```typescript
// app/__tests__/cards-flow.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import CardsScreen from '../cards';

test('filters cards when filter is selected', () => {
  const { getByText, queryByText } = render(<CardsScreen />);

  fireEvent.press(getByText('Physical'));

  expect(queryByText('Virtual Card')).toBeNull();
  expect(getByText('Physical Card')).toBeTruthy();
});
```

---

## 3. End-to-End (E2E) Tests

### What to Test
- Complete user flows (opening app → navigating to cards → filtering)
- Real device/simulator behavior
- Platform-specific functionality

### Option A: Detox (Recommended for React Native)

```bash
npm install --save-dev detox detox-cli
```

**Pros:**
- Native React Native support
- Synchronization with animations
- Cross-platform (iOS & Android)

**Cons:**
- Complex setup
- Requires native build configuration

### Option B: Maestro (Newer, Simpler)

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**Pros:**
- No code required (uses YAML)
- Fast setup
- Cloud testing support

**Cons:**
- Less mature ecosystem
- Limited customization

### Example Maestro Flow

```yaml
# maestro/card-filtering.yaml
appId: com.instacard.sdk
---
- launchApp
- tapOn: "Cards"
- tapOn: "Physical"
- assertVisible: "Physical Card"
- assertNotVisible: "Virtual Card"
```

---

## 4. Visual Regression Tests

### What to Test
- UI consistency across changes
- Component visual states (hover, pressed, disabled)
- Theme variations (light/dark mode)

### Options

#### Option A: Storybook + Chromatic

```bash
npm install --save-dev @storybook/react-native
```

Component-level visual testing with automatic screenshot comparison.

#### Option B: Detox + Pixelmatch

```bash
npm install --save-dev pixelmatch
```

Screenshot comparison during E2E tests.

---

## 5. Type Checking & Static Analysis

### Already Available

```bash
npx tsc --noEmit          # Type checking
npm run lint              # ESLint (already configured)
```

### Enhance With

```bash
npm install --save-dev @typescript-eslint/eslint-plugin eslint-plugin-react-hooks
```

Add to `.eslintrc.js`:

```javascript
module.exports = {
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
```

---

## 6. Performance Testing

### What to Test
- Animation frame rates
- Component render performance
- List scrolling performance

### Tools

#### Built-in Performance Monitor
Enable in-app performance overlay:
- iOS: Shake device → "Show Perf Monitor"
- Android: Shake device → "Show Perf Monitor"

#### Flipper
```bash
npm install --save-dev react-native-flipper
```

React DevTools integration for component profiling.

#### React Native Performance
```bash
npm install react-native-performance
```

Programmatic performance metrics.

### Example

```typescript
import Performance from 'react-native-performance';

Performance.mark('cardList:start');
// ... render card list
Performance.mark('cardList:end');
Performance.measure('cardList', 'cardList:start', 'cardList:end');
```

---

## 7. Accessibility Testing

### What to Test
- Screen reader compatibility (iOS VoiceOver, Android TalkBack)
- Accessible labels and hints
- Color contrast ratios
- Touch target sizes

### Built into Testing Library

```typescript
import { render } from '@testing-library/react-native';

test('card item is accessible', () => {
  const { getByRole } = render(<CardItem />);

  const button = getByRole('button');
  expect(button).toBeAccessible();
});
```

### Manual Testing
- iOS: Settings → Accessibility → VoiceOver
- Android: Settings → Accessibility → TalkBack

---

## Recommended Testing Strategy

### Phase 1: Foundation (Start Here)

1. **Unit tests** for reusable components
   - `components/cards/CardItem`
   - `components/cards/FilterBar`
   - `components/cards/GreetingBar`

2. **Snapshot tests** for stable UI components
   ```typescript
   expect(tree).toMatchSnapshot();
   ```

3. **ESLint + TypeScript** (already configured)
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

**Goal:** 60%+ code coverage on components

---

### Phase 2: Integration (Add Next)

4. **Integration tests** for screen interactions
   - Cards screen filtering
   - Navigation flows
   - Bottom sheet interactions

5. **E2E tests with Maestro**
   - Home to Cards flow
   - Filter selection
   - Card detail navigation (when implemented)

**Goal:** All critical user paths covered

---

### Phase 3: Polish (Long-term)

6. **Visual regression** for UI consistency
   - Theme switching
   - Component states
   - Screen layouts

7. **Accessibility tests** for compliance
   - Screen reader support
   - WCAG compliance
   - Touch target validation

**Goal:** Production-ready quality

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm test
      - run: npx tsc --noEmit
```

---

## Test Coverage Goals

| Test Type | Target Coverage | Priority |
|-----------|----------------|----------|
| Unit Tests | 70%+ | High |
| Integration Tests | Critical paths | High |
| E2E Tests | Main user flows | Medium |
| Visual Regression | UI components | Medium |
| Accessibility | All interactive elements | Low |

---

## Quick Start

To begin testing setup, run:

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Create jest.config.js
# Add test scripts to package.json
# Create __tests__ directories in components/
```

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [Maestro Documentation](https://maestro.mobile.dev/)
- [Expo Testing Guide](https://docs.expo.dev/develop/unit-testing/)

---

## Notes

- **Animation Testing**: Reanimated animations require special mocking setup
- **Native Modules**: Expo modules may need manual mocks
- **Platform-Specific**: Some tests may need separate iOS/Android implementations
- **CI Performance**: E2E tests are slower; consider running on specific branches only
