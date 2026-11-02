import { renderHook } from '@testing-library/react';
import { StrictMode } from 'react';
import { useWorkspaceQuestion } from './use-workspace-question';

const mockNavigate = jest.fn();
let mockLocation: {
  key: string;
  pathname: string;
  search: string;
  hash: string;
  state: Record<string, unknown> | null;
};
jest.mock('react-router', () => ({
  useLocation: () => mockLocation,
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
  mockLocation = {
    key: 'workspace-entry',
    pathname: '/chat/assistant-1',
    search: '',
    hash: '',
    state: { workspaceQuestion: 'Summarise our policy', otherState: true },
  };
});

it('prefills a draft only once under StrictMode and removes it from history state', () => {
  const setValue = jest.fn();
  renderHook(() => useWorkspaceQuestion(setValue), { wrapper: StrictMode });
  expect(setValue).toHaveBeenCalledTimes(1);
  expect(setValue).toHaveBeenCalledWith('Summarise our policy');
  expect(mockNavigate).toHaveBeenCalledWith('/chat/assistant-1', {
    replace: true,
    state: { otherState: true },
  });
});

it('leaves ordinary chat navigation untouched', () => {
  mockLocation.state = null;
  const setValue = jest.fn();
  renderHook(() => useWorkspaceQuestion(setValue));
  expect(setValue).not.toHaveBeenCalled();
  expect(mockNavigate).not.toHaveBeenCalled();
});
