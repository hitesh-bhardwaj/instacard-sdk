import { View } from 'react-native';
import { render } from '@testing-library/react-native';

import { ThemedView } from '../themed-view';
import * as useThemeColor from '@/hooks/use-theme-color';

jest.mock('@/hooks/use-theme-color');

describe('ThemedView', () => {
  const mockUseThemeColor = useThemeColor.useThemeColor as jest.MockedFunction<
    typeof useThemeColor.useThemeColor
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseThemeColor.mockReturnValue('#ffffff');
  });

  describe('Rendering', () => {
    it('renders as a View component', () => {
      const { UNSAFE_getByType } = render(<ThemedView />);

      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('renders children correctly', () => {
      const { UNSAFE_getByType } = render(
        <ThemedView>
          <View testID="child-view" />
        </ThemedView>
      );

      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('renders multiple children', () => {
      const { UNSAFE_getAllByType } = render(
        <ThemedView>
          <View testID="child-1" />
          <View testID="child-2" />
        </ThemedView>
      );

      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Theme Colors', () => {
    it('calls useThemeColor with light and dark colors', () => {
      render(
        <ThemedView lightColor="#ffffff" darkColor="#000000" />
      );

      expect(mockUseThemeColor).toHaveBeenCalledWith(
        { light: '#ffffff', dark: '#000000' },
        'background'
      );
    });

    it('calls useThemeColor with empty object when no colors provided', () => {
      render(<ThemedView />);

      expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'background');
    });

    it('applies theme background color to view', () => {
      mockUseThemeColor.mockReturnValue('#ff0000');

      const { UNSAFE_getByType } = render(<ThemedView />);
      const view = UNSAFE_getByType(View);

      expect(view.props.style).toEqual(
        expect.arrayContaining([{ backgroundColor: '#ff0000' }])
      );
    });

    it('uses custom light color in light theme', () => {
      mockUseThemeColor.mockReturnValue('#f0f0f0');

      const { UNSAFE_getByType } = render(<ThemedView lightColor="#f0f0f0" />);
      const view = UNSAFE_getByType(View);

      expect(view.props.style).toEqual(
        expect.arrayContaining([{ backgroundColor: '#f0f0f0' }])
      );
    });

    it('uses custom dark color in dark theme', () => {
      mockUseThemeColor.mockReturnValue('#1a1a1a');

      const { UNSAFE_getByType } = render(<ThemedView darkColor="#1a1a1a" />);
      const view = UNSAFE_getByType(View);

      expect(view.props.style).toEqual(
        expect.arrayContaining([{ backgroundColor: '#1a1a1a' }])
      );
    });
  });

  describe('Custom Styling', () => {
    it('accepts and applies custom style prop', () => {
      const customStyle = { padding: 20, margin: 10 };

      const { UNSAFE_getByType } = render(<ThemedView style={customStyle} />);
      const view = UNSAFE_getByType(View);

      expect(view.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)])
      );
    });

    it('merges theme background with custom styles', () => {
      mockUseThemeColor.mockReturnValue('#ffffff');
      const customStyle = { padding: 20, borderRadius: 10 };

      const { UNSAFE_getByType } = render(<ThemedView style={customStyle} />);
      const view = UNSAFE_getByType(View);

      expect(view.props.style).toEqual(
        expect.arrayContaining([
          { backgroundColor: '#ffffff' },
          expect.objectContaining(customStyle),
        ])
      );
    });

    it('custom styles can override background color', () => {
      mockUseThemeColor.mockReturnValue('#ffffff');
      const customStyle = { backgroundColor: '#ff0000' };

      const { UNSAFE_getByType } = render(<ThemedView style={customStyle} />);
      const view = UNSAFE_getByType(View);

      // Last style in array should win
      expect(view.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)])
      );
    });

    it('accepts style as array', () => {
      const styles = [{ padding: 10 }, { margin: 5 }];

      const { UNSAFE_getByType } = render(<ThemedView style={styles} />);
      const view = UNSAFE_getByType(View);

      expect(view.props.style).toBeTruthy();
    });
  });

  describe('View Props', () => {
    it('forwards all View props', () => {
      const { UNSAFE_getByType } = render(
        <ThemedView
          testID="test-view"
          accessibilityLabel="Test label"
          accessibilityRole="button"
        />
      );

      const view = UNSAFE_getByType(View);

      expect(view.props.testID).toBe('test-view');
      expect(view.props.accessibilityLabel).toBe('Test label');
      expect(view.props.accessibilityRole).toBe('button');
    });

    it('forwards onLayout prop', () => {
      const onLayout = jest.fn();

      const { UNSAFE_getByType } = render(<ThemedView onLayout={onLayout} />);
      const view = UNSAFE_getByType(View);

      expect(view.props.onLayout).toBe(onLayout);
    });

    it('forwards touch event handlers', () => {
      const onTouchStart = jest.fn();
      const onTouchEnd = jest.fn();

      const { UNSAFE_getByType } = render(
        <ThemedView onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} />
      );
      const view = UNSAFE_getByType(View);

      expect(view.props.onTouchStart).toBe(onTouchStart);
      expect(view.props.onTouchEnd).toBe(onTouchEnd);
    });
  });

  describe('Theme Updates', () => {
    it('updates background when theme color changes', () => {
      mockUseThemeColor.mockReturnValue('#ffffff');

      const { UNSAFE_getByType, rerender } = render(<ThemedView />);
      let view = UNSAFE_getByType(View);

      expect(view.props.style).toEqual(
        expect.arrayContaining([{ backgroundColor: '#ffffff' }])
      );

      mockUseThemeColor.mockReturnValue('#000000');
      rerender(<ThemedView />);

      view = UNSAFE_getByType(View);
      expect(view.props.style).toEqual(
        expect.arrayContaining([{ backgroundColor: '#000000' }])
      );
    });

    it('updates when lightColor prop changes', () => {
      const { UNSAFE_getByType, rerender } = render(
        <ThemedView lightColor="#ffffff" />
      );

      rerender(<ThemedView lightColor="#f0f0f0" />);

      expect(mockUseThemeColor).toHaveBeenLastCalledWith(
        { light: '#f0f0f0' },
        'background'
      );
    });

    it('updates when darkColor prop changes', () => {
      const { rerender } = render(<ThemedView darkColor="#000000" />);

      rerender(<ThemedView darkColor="#1a1a1a" />);

      expect(mockUseThemeColor).toHaveBeenLastCalledWith(
        { dark: '#1a1a1a' },
        'background'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined children', () => {
      const { UNSAFE_getByType } = render(<ThemedView>{undefined}</ThemedView>);

      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('handles null children', () => {
      const { UNSAFE_getByType } = render(<ThemedView>{null}</ThemedView>);

      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('handles conditional children', () => {
      const showChild = true;

      const { UNSAFE_getAllByType } = render(
        <ThemedView>
          {showChild && <View />}
        </ThemedView>
      );

      // Should render ThemedView + conditional child
      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThanOrEqual(2);
    });

    it('works with empty style prop', () => {
      const { UNSAFE_getByType } = render(<ThemedView style={{}} />);

      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('works with null style prop', () => {
      const { UNSAFE_getByType } = render(<ThemedView style={null as any} />);

      expect(UNSAFE_getByType(View)).toBeTruthy();
    });
  });

  describe('Nested ThemedViews', () => {
    it('renders nested ThemedViews correctly', () => {
      mockUseThemeColor.mockReturnValue('#ffffff');

      const { UNSAFE_getAllByType } = render(
        <ThemedView>
          <ThemedView>
            <ThemedView />
          </ThemedView>
        </ThemedView>
      );

      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThanOrEqual(3);
    });

    it('nested ThemedViews can have different colors', () => {
      mockUseThemeColor
        .mockReturnValueOnce('#ffffff')
        .mockReturnValueOnce('#000000');

      render(
        <ThemedView lightColor="#ffffff">
          <ThemedView darkColor="#000000" />
        </ThemedView>
      );

      expect(mockUseThemeColor).toHaveBeenCalledTimes(2);
    });
  });
});
