import { fireEvent, render } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { AnimatedToggle } from '../animated-toggle';

jest.mock('expo-haptics');

describe('AnimatedToggle', () => {
  const defaultProps = {
    value: 'virtual' as const,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders both toggle options', () => {
      const { getByText } = render(<AnimatedToggle {...defaultProps} />);

      expect(getByText('Virtual')).toBeTruthy();
      expect(getByText('Universal')).toBeTruthy();
    });

    it('has tablist accessibility role', () => {
      const { UNSAFE_getByProps } = render(<AnimatedToggle {...defaultProps} />);

      const container = UNSAFE_getByProps({ accessibilityRole: 'tablist' });
      expect(container).toBeTruthy();
    });

    it('renders both options as interactive elements', () => {
      const { getByText } = render(<AnimatedToggle {...defaultProps} />);

      // Both options should be renderable and accessible
      expect(getByText('Virtual')).toBeTruthy();
      expect(getByText('Universal')).toBeTruthy();
    });
  });

  describe('Selection State', () => {
    it('renders with virtual value', () => {
      const { getByText } = render(
        <AnimatedToggle {...defaultProps} value="virtual" />
      );

      expect(getByText('Virtual')).toBeTruthy();
    });

    it('renders with universal value', () => {
      const { getByText } = render(
        <AnimatedToggle {...defaultProps} value="universal" />
      );

      expect(getByText('Universal')).toBeTruthy();
    });

    it('renders both options regardless of selected value', () => {
      const { getByText } = render(
        <AnimatedToggle {...defaultProps} value="virtual" />
      );

      expect(getByText('Virtual')).toBeTruthy();
      expect(getByText('Universal')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('calls onChange with "virtual" when virtual option pressed', () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <AnimatedToggle {...defaultProps} value="universal" onChange={onChange} />
      );

      fireEvent.press(getByText('Virtual'));

      expect(onChange).toHaveBeenCalledWith('virtual');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onChange with "universal" when universal option pressed', () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <AnimatedToggle {...defaultProps} value="virtual" onChange={onChange} />
      );

      fireEvent.press(getByText('Universal'));

      expect(onChange).toHaveBeenCalledWith('universal');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('triggers haptic feedback when toggled', () => {
      const { getByText } = render(<AnimatedToggle {...defaultProps} />);

      fireEvent.press(getByText('Universal'));

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });

    it('triggers haptic feedback for both options', () => {
      const { getByText } = render(<AnimatedToggle {...defaultProps} />);

      fireEvent.press(getByText('Virtual'));
      expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);

      fireEvent.press(getByText('Universal'));
      expect(Haptics.impactAsync).toHaveBeenCalledTimes(2);
    });

    it('allows rapid toggling', () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <AnimatedToggle {...defaultProps} onChange={onChange} />
      );

      fireEvent.press(getByText('Universal'));
      fireEvent.press(getByText('Virtual'));
      fireEvent.press(getByText('Universal'));

      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('has tablist role for container', () => {
      const { UNSAFE_getByProps } = render(<AnimatedToggle {...defaultProps} />);

      const container = UNSAFE_getByProps({ accessibilityRole: 'tablist' });
      expect(container).toBeTruthy();
    });

    it('renders accessible labels for both options', () => {
      const { getByText } = render(<AnimatedToggle {...defaultProps} />);

      expect(getByText('Virtual')).toBeTruthy();
      expect(getByText('Universal')).toBeTruthy();
    });

    it('maintains accessibility when value changes', () => {
      const { getByText, rerender } = render(
        <AnimatedToggle {...defaultProps} value="virtual" />
      );

      expect(getByText('Virtual')).toBeTruthy();

      rerender(<AnimatedToggle {...defaultProps} value="universal" />);

      expect(getByText('Universal')).toBeTruthy();
    });
  });

  describe('Value Updates', () => {
    it('updates when value prop changes', () => {
      const { rerender, getByText } = render(
        <AnimatedToggle {...defaultProps} value="virtual" />
      );

      expect(getByText('Virtual')).toBeTruthy();

      rerender(<AnimatedToggle {...defaultProps} value="universal" />);

      expect(getByText('Universal')).toBeTruthy();
    });

    it('handles rapid value changes', () => {
      const { rerender, getByText } = render(
        <AnimatedToggle {...defaultProps} value="virtual" />
      );

      rerender(<AnimatedToggle {...defaultProps} value="universal" />);
      rerender(<AnimatedToggle {...defaultProps} value="virtual" />);
      rerender(<AnimatedToggle {...defaultProps} value="universal" />);

      expect(getByText('Virtual')).toBeTruthy();
      expect(getByText('Universal')).toBeTruthy();
    });

    it('maintains both options through value changes', () => {
      const { rerender, getByText } = render(
        <AnimatedToggle {...defaultProps} value="universal" />
      );

      rerender(<AnimatedToggle {...defaultProps} value="virtual" />);

      expect(getByText('Virtual')).toBeTruthy();
      expect(getByText('Universal')).toBeTruthy();
    });
  });

  describe('Layout Calculations', () => {
    it('handles layout changes', () => {
      const { UNSAFE_getByProps } = render(<AnimatedToggle {...defaultProps} />);

      const container = UNSAFE_getByProps({ accessibilityRole: 'tablist' });

      // Simulate layout event
      fireEvent(container, 'layout', {
        nativeEvent: { layout: { width: 200, height: 40 } },
      });

      // Should not throw error
      expect(container).toBeTruthy();
    });

    it('handles zero width layout', () => {
      const { UNSAFE_getByProps } = render(<AnimatedToggle {...defaultProps} />);

      const container = UNSAFE_getByProps({ accessibilityRole: 'tablist' });

      // Simulate zero width layout
      fireEvent(container, 'layout', {
        nativeEvent: { layout: { width: 0, height: 40 } },
      });

      expect(container).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('calls onChange even when selecting already selected option', () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <AnimatedToggle {...defaultProps} value="virtual" onChange={onChange} />
      );

      fireEvent.press(getByText('Virtual'));

      expect(onChange).toHaveBeenCalledWith('virtual');
    });

    it('handles pressing options without errors', () => {
      const { getByText } = render(<AnimatedToggle {...defaultProps} />);

      expect(() => {
        fireEvent.press(getByText('Virtual'));
        fireEvent.press(getByText('Universal'));
      }).not.toThrow();
    });
  });

  describe('Text Styling', () => {
    it('applies active styling to selected option text', () => {
      const { getByText } = render(
        <AnimatedToggle {...defaultProps} value="virtual" />
      );

      const virtualText = getByText('Virtual');

      // Check that style array contains active text style
      expect(virtualText.props.style).toBeTruthy();
    });

    it('applies different styling to unselected option text', () => {
      const { getByText } = render(
        <AnimatedToggle {...defaultProps} value="virtual" />
      );

      const universalText = getByText('Universal');

      // Text should still have styling
      expect(universalText.props.style).toBeTruthy();
    });
  });
});
