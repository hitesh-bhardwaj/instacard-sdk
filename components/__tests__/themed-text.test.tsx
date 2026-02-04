import { render } from '@testing-library/react-native';

import { ThemedText } from '../themed-text';

describe('ThemedText', () => {
  it('renders with default type', () => {
    const { getByText } = render(<ThemedText>Hello World</ThemedText>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders with title type', () => {
    const { getByText } = render(
      <ThemedText type="title">Title Text</ThemedText>
    );
    expect(getByText('Title Text')).toBeTruthy();
  });

  it('renders with subtitle type', () => {
    const { getByText } = render(
      <ThemedText type="subtitle">Subtitle Text</ThemedText>
    );
    expect(getByText('Subtitle Text')).toBeTruthy();
  });

  it('renders with link type', () => {
    const { getByText } = render(
      <ThemedText type="link">Link Text</ThemedText>
    );
    expect(getByText('Link Text')).toBeTruthy();
  });

  it('renders with defaultSemiBold type', () => {
    const { getByText } = render(
      <ThemedText type="defaultSemiBold">Bold Text</ThemedText>
    );
    expect(getByText('Bold Text')).toBeTruthy();
  });

  it('accepts additional TextProps', () => {
    const { getByText } = render(
      <ThemedText numberOfLines={1} ellipsizeMode="tail">
        Long text that should be truncated
      </ThemedText>
    );
    const textElement = getByText('Long text that should be truncated');
    expect(textElement.props.numberOfLines).toBe(1);
    expect(textElement.props.ellipsizeMode).toBe('tail');
  });

  it('accepts custom style prop', () => {
    const customStyle = { fontSize: 20, fontWeight: 'bold' as const };
    const { getByText } = render(
      <ThemedText style={customStyle}>Styled Text</ThemedText>
    );
    const textElement = getByText('Styled Text');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)])
    );
  });
});
