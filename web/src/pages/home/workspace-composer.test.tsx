import { fireEvent, render, screen } from '@testing-library/react';
import { WorkspaceComposer } from './workspace-composer';

const mockNavigate = jest.fn();
const mockUseFetchChatList = jest.fn();
jest.mock('@/routes', () => ({ Routes: { Chat: '/chat', Chats: '/chats' } }));
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  Link: 'a',
}));
jest.mock('@/hooks/use-chat-request', () => ({
  useFetchChatList: () => mockUseFetchChatList(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

beforeEach(() => {
  mockNavigate.mockReset();
  mockUseFetchChatList.mockReturnValue({
    data: {
      chats: [
        { id: 'first', name: 'Research' },
        { id: 'second', name: 'Policies' },
      ],
    },
    loading: false,
  });
});

it('opens the selected assistant with a private draft rather than putting the question in the URL', () => {
  render(<WorkspaceComposer />);
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'second' },
  });
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: '  What is our leave policy?  ' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'workspace.continue' }));
  expect(mockNavigate).toHaveBeenCalledWith('/chat/second', {
    state: { workspaceQuestion: 'What is our leave policy?' },
  });
});

it('prefills a suggestion without submitting it', () => {
  render(<WorkspaceComposer />);
  fireEvent.click(
    screen.getByRole('button', { name: /workspace.compareTitle/ }),
  );
  expect(screen.getByRole('textbox')).toHaveValue('workspace.comparePrompt');
  expect(screen.getByRole('textbox')).toHaveFocus();
  expect(mockNavigate).not.toHaveBeenCalled();
});

it('offers assistant creation and prevents sending when no assistant exists', () => {
  mockUseFetchChatList.mockReturnValue({ data: { chats: [] }, loading: false });
  render(<WorkspaceComposer />);
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'My question' },
  });
  expect(
    screen.getByRole('button', { name: 'workspace.continue' }),
  ).toBeDisabled();
  expect(screen.getByText('workspace.createAssistant')).toHaveAttribute(
    'to',
    '/chats?isCreate=true',
  );
});
