import { renderHook } from '@testing-library/react-native';

import { useThemeColor } from '../use-theme-color';
import * as useColorScheme from '../use-color-scheme';

// Mock the useColorScheme hook
jest.mock('../use-color-scheme');

describe('useThemeColor', () => {
  const mockUseColorScheme = useColorScheme.useColorScheme as jest.MockedFunction<
    typeof useColorScheme.useColorScheme
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns light color when theme is light', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#ffffff', dark: '#000000' }, 'text')
    );

    expect(result.current).toBe('#ffffff');
  });

  it('returns dark color when theme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#ffffff', dark: '#000000' }, 'text')
    );

    expect(result.current).toBe('#000000');
  });

  it('returns default theme color when no custom color provided', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    // Should return the default light theme text color
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('string');
  });

  it('prioritizes custom light color over theme default', () => {
    mockUseColorScheme.mockReturnValue('light');

    const customColor = '#ff0000';
    const { result } = renderHook(() =>
      useThemeColor({ light: customColor }, 'text')
    );

    expect(result.current).toBe(customColor);
  });

  it('prioritizes custom dark color over theme default', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const customColor = '#0000ff';
    const { result } = renderHook(() =>
      useThemeColor({ dark: customColor }, 'text')
    );

    expect(result.current).toBe(customColor);
  });

  it('defaults to light theme when useColorScheme returns null', () => {
    mockUseColorScheme.mockReturnValue(null);

    const { result } = renderHook(() =>
      useThemeColor({ light: '#ffffff', dark: '#000000' }, 'text')
    );

    expect(result.current).toBe('#ffffff');
  });

  it('works with different color names', () => {
    mockUseColorScheme.mockReturnValue('light');

    const colorNames = ['text', 'background', 'tint', 'icon', 'tabIconDefault', 'tabIconSelected'] as const;

    colorNames.forEach((colorName) => {
      const { result } = renderHook(() => useThemeColor({}, colorName));
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('string');
    });
  });
});
