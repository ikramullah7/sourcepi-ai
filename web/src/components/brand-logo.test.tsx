import { render, screen } from '@testing-library/react';
import { ThemeEnum } from '@/constants/common';
import { ThemeProvider } from './theme-provider';
import { BrandLogo } from './brand-logo';

beforeEach(() => localStorage.clear());

it('exposes a single accessible product name', () => {
  const { container } = render(<BrandLogo />);
  expect(screen.getByRole('img', { name: 'SourcePi AI' })).toBeInTheDocument();
  expect(container.querySelector('img')).toHaveAttribute(
    'src',
    '/logo.svg?v=sourcepi-pi',
  );
});

it('uses the readable mark variant for dark mode', () => {
  const { container } = render(
    <ThemeProvider defaultTheme={ThemeEnum.Dark} storageKey="test-brand-theme">
      <BrandLogo />
    </ThemeProvider>,
  );
  expect(container.querySelector('img')).toHaveAttribute(
    'src',
    '/logo-dark.svg?v=sourcepi-pi',
  );
});

it('preserves a configured embedded application name', () => {
  render(<BrandLogo name="Research workspace" />);
  expect(
    screen.getByRole('img', { name: 'Research workspace' }),
  ).toBeInTheDocument();
  expect(screen.getByText('Research workspace')).toBeInTheDocument();
  expect(screen.queryByText('SourcePi')).not.toBeInTheDocument();
});
