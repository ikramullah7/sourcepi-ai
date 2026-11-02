jest.mock('eventsource-parser/stream', () => ({}));
jest.mock('@/hooks/route-hook', () => ({}));

import { act, renderHook } from '@testing-library/react';
import { useScrollToBottom } from '../logic-hooks';

function createMockContainer({ atBottom = true } = {}) {
  const container = document.createElement('div');
  Object.defineProperties(container, {
    clientHeight: { value: 100 },
    scrollHeight: { value: 200 },
  });
  container.scrollTop = atBottom ? 100 : 0;
  container.scrollTo = jest.fn();
  return { current: container };
}

function flushFrame() {
  act(() => jest.advanceTimersByTime(16));
}

describe('useScrollToBottom', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('is at the bottom when the container is pinned', () => {
    const container = createMockContainer();
    const { result } = renderHook(() => useScrollToBottom([], container));
    expect(result.current.isAtBottom).toBe(true);
  });

  it('is not at the bottom when the user is reading earlier messages', () => {
    const container = createMockContainer({ atBottom: false });
    const { result } = renderHook(() => useScrollToBottom([], container));
    expect(result.current.isAtBottom).toBe(false);
  });

  it('scrolls the container when messages change while pinned', () => {
    const container = createMockContainer();
    const { rerender } = renderHook(
      ({ messages }) => useScrollToBottom(messages, container),
      { initialProps: { messages: [] as string[] } },
    );
    rerender({ messages: ['message'] });
    flushFrame();
    expect(container.current.scrollTo).toHaveBeenCalledWith({
      top: 200,
      behavior: 'auto',
    });
  });

  it('does not pull the user down after they scroll up, even with a queued frame', () => {
    const container = createMockContainer();
    const { result, rerender } = renderHook(
      ({ messages }) => useScrollToBottom(messages, container),
      { initialProps: { messages: [] as string[] } },
    );
    act(() => {
      container.current.scrollTop = 0;
      container.current.dispatchEvent(new Event('scroll'));
    });
    rerender({ messages: ['message'] });
    flushFrame();
    expect(result.current.isAtBottom).toBe(false);
    expect(container.current.scrollTo).not.toHaveBeenCalled();
  });

  it('shows the scroll-to-bottom affordance away from the bottom', () => {
    const container = createMockContainer({ atBottom: false });
    const { result } = renderHook(() => useScrollToBottom([], container));
    expect(result.current.isAtBottom).toBe(false);
  });

  it('cancels a pending scroll when unmounted', () => {
    const container = createMockContainer();
    const { unmount } = renderHook(() => useScrollToBottom([], container));
    unmount();
    flushFrame();
    expect(container.current.scrollTo).not.toHaveBeenCalled();
  });
});
