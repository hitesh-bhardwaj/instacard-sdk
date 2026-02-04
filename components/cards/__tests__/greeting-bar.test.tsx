import { fireEvent, render } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { GreetingBar } from '../greeting-bar';

jest.mock('expo-haptics');

describe('GreetingBar', () => {
  const defaultProps = {
    userName: 'John Doe',
    mode: 'virtual' as const,
    onModeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders greeting with user name', () => {
      const { getByText } = render(<GreetingBar {...defaultProps} />);

      expect(getByText('Hello, John Doe')).toBeTruthy();
    });

    it('renders greeting with different user name', () => {
      const { getByText } = render(
        <GreetingBar {...defaultProps} userName="Jane Smith" />
      );

      expect(getByText('Hello, Jane Smith')).toBeTruthy();
    });

    it('renders AnimatedToggle component', () => {
      const { UNSAFE_getByType } = render(<GreetingBar {...defaultProps} />);

      // AnimatedToggle should be present
      const { AnimatedToggle } = require('@/components/ui/animated-toggle');
      expect(UNSAFE_getByType(AnimatedToggle)).toBeTruthy();
    });

    it('has correct accessibility role for greeting', () => {
      const { getByText } = render(<GreetingBar {...defaultProps} />);

      const greeting = getByText('Hello, John Doe');
      expect(greeting.props.accessibilityRole).toBe('text');
    });
  });

  describe('Toggle Mode', () => {
    it('passes virtual mode to AnimatedToggle', () => {
      const { UNSAFE_getByType } = render(
        <GreetingBar {...defaultProps} mode="virtual" />
      );

      const { AnimatedToggle } = require('@/components/ui/animated-toggle');
      const toggle = UNSAFE_getByType(AnimatedToggle);

      expect(toggle.props.value).toBe('virtual');
    });

    it('passes universal mode to AnimatedToggle', () => {
      const { UNSAFE_getByType } = render(
        <GreetingBar {...defaultProps} mode="universal" />
      );

      const { AnimatedToggle } = require('@/components/ui/animated-toggle');
      const toggle = UNSAFE_getByType(AnimatedToggle);

      expect(toggle.props.value).toBe('universal');
    });

    it('calls onModeChange when toggle changes', () => {
      const onModeChange = jest.fn();
      const { UNSAFE_getByType } = render(
        <GreetingBar {...defaultProps} onModeChange={onModeChange} />
      );

      const { AnimatedToggle } = require('@/components/ui/animated-toggle');
      const toggle = UNSAFE_getByType(AnimatedToggle);

      // Simulate toggle change
      toggle.props.onChange('universal');

      expect(onModeChange).toHaveBeenCalledWith('universal');
      expect(onModeChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Name Variations', () => {
    it('handles empty string user name', () => {
      const { getByText } = render(<GreetingBar {...defaultProps} userName="" />);

      expect(getByText('Hello, ')).toBeTruthy();
    });

    it('handles user name with special characters', () => {
      const { getByText } = render(
        <GreetingBar {...defaultProps} userName="O'Connor-Smith" />
      );

      expect(getByText("Hello, O'Connor-Smith")).toBeTruthy();
    });

    it('handles long user name', () => {
      const longName = 'Bartholomew Christopher Alexander';
      const { getByText } = render(
        <GreetingBar {...defaultProps} userName={longName} />
      );

      expect(getByText(`Hello, ${longName}`)).toBeTruthy();
    });
  });

  describe('Layout', () => {
    it('renders container with greeting and toggle', () => {
      const { getByText, UNSAFE_getByType } = render(
        <GreetingBar {...defaultProps} />
      );

      expect(getByText('Hello, John Doe')).toBeTruthy();

      const { AnimatedToggle } = require('@/components/ui/animated-toggle');
      expect(UNSAFE_getByType(AnimatedToggle)).toBeTruthy();
    });
  });
});
