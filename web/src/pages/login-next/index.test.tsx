import { useSystemConfig } from '@/hooks/use-system-request';
import { useLoginChannels } from '@/hooks/use-login-request';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Login from './index';

const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockChannelLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@/hooks/use-system-request', () => ({
  useSystemConfig: jest.fn(),
}));

jest.mock('@/hooks/auth-hooks', () => ({
  useAuth: () => ({ isLogin: false }),
}));

jest.mock('@/hooks/use-login-request', () => ({
  useLogin: () => ({ login: mockLogin, loading: false }),
  useRegister: () => ({ register: mockRegister, loading: false }),
  useLoginChannels: jest.fn(),
  useLoginWithChannel: () => ({ login: mockChannelLogin, loading: false }),
}));

jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/utils', () => ({ rsaPsw: () => 'encrypted-password' }));
jest.mock('@/components/svg-icon', () => () => null);

const MockUseSystemConfig = jest.mocked(useSystemConfig);
const MockUseLoginChannels = jest.mocked(useLoginChannels);
const OriginalResizeObserver = globalThis.ResizeObserver;

beforeAll(() => {
  globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterAll(() => {
  globalThis.ResizeObserver = OriginalResizeObserver;
});

describe('login registration entry', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockLogin.mockResolvedValue(0);
    mockRegister.mockReset();
    mockRegister.mockResolvedValue(0);
    mockChannelLogin.mockReset();
    mockNavigate.mockReset();
    MockUseLoginChannels.mockReturnValue({ channels: [], loading: false });
    MockUseSystemConfig.mockReturnValue({ config: undefined, loading: true });
  });

  it.each([0, false])(
    'keeps sign up hidden while loading and when registerEnabled is %s',
    (registerEnabled) => {
      const { rerender } = render(<Login />);

      expect(
        screen.queryByTestId('auth-toggle-register'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('auth-submit')).toBeEnabled();

      MockUseSystemConfig.mockReturnValue({
        config: { registerEnabled },
        loading: false,
      });
      rerender(<Login />);

      expect(
        screen.queryByTestId('auth-toggle-register'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('auth-submit')).toBeEnabled();
    },
  );

  it.each([1, true])(
    'allows switching to sign up when registerEnabled is %s',
    async (registerEnabled) => {
      const { rerender } = render(<Login />);

      expect(
        screen.queryByTestId('auth-toggle-register'),
      ).not.toBeInTheDocument();

      MockUseSystemConfig.mockReturnValue({
        config: { registerEnabled },
        loading: false,
      });
      rerender(<Login />);

      fireEvent.click(screen.getByTestId('auth-toggle-register'));

      await waitFor(() => {
        expect(screen.getByTestId('auth-nickname')).toBeInTheDocument();
      });
    },
  );

  it('keeps sign up hidden when loading ends without a configuration', () => {
    MockUseSystemConfig.mockReturnValue({ config: undefined, loading: false });

    render(<Login />);

    expect(
      screen.queryByTestId('auth-toggle-register'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('auth-submit')).toBeEnabled();
  });

  it('submits the password through the existing login flow', async () => {
    render(<Login />);
    fireEvent.change(screen.getByTestId('auth-email'), {
      target: { value: 'person@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-password'), {
      target: { value: 'test-password' },
    });
    fireEvent.click(screen.getByTestId('auth-submit'));
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'person@example.com',
        password: 'encrypted-password',
      }),
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows only SSO actions when password login is disabled', () => {
    MockUseSystemConfig.mockReturnValue({
      config: { disablePasswordLogin: true, registerEnabled: true },
      loading: false,
    });
    MockUseLoginChannels.mockReturnValue({
      channels: [
        { channel: 'company-sso', display_name: 'Company SSO', icon: 'sso' },
      ],
      loading: false,
    });
    render(<Login />);
    expect(screen.queryByTestId('auth-form')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('auth-toggle-register'),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'workspace.signInWith' }),
    );
    expect(mockChannelLogin).toHaveBeenCalledWith('company-sso');
  });

  it('keeps a single active form and returns to login after registration', async () => {
    MockUseSystemConfig.mockReturnValue({
      config: { registerEnabled: true },
      loading: false,
    });
    render(<Login />);
    fireEvent.click(screen.getByTestId('auth-toggle-register'));
    expect(screen.getAllByTestId('auth-form')).toHaveLength(1);
    expect(screen.getByTestId('auth-password')).toHaveAttribute(
      'autocomplete',
      'new-password',
    );
    fireEvent.change(screen.getByTestId('auth-email'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-nickname'), {
      target: { value: 'Taylor' },
    });
    fireEvent.change(screen.getByTestId('auth-password'), {
      target: { value: 'test-password' },
    });
    fireEvent.click(screen.getByTestId('auth-submit'));
    await waitFor(() =>
      expect(mockRegister).toHaveBeenCalledWith({
        nickname: 'Taylor',
        email: 'new@example.com',
        password: 'encrypted-password',
      }),
    );
    await waitFor(() =>
      expect(screen.queryByTestId('auth-nickname')).not.toBeInTheDocument(),
    );
    expect(screen.getByTestId('auth-password')).toHaveAttribute(
      'autocomplete',
      'current-password',
    );
  });
});
