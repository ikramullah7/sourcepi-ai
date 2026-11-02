import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

/** Consume the workspace draft once, without sending or adding it to the URL. */
export function useWorkspaceQuestion(setValue: (value: string) => void) {
  const location = useLocation();
  const navigate = useNavigate();
  const consumedKey = useRef<string>();
  useEffect(() => {
    const state = location.state;
    if (
      !state ||
      typeof state.workspaceQuestion !== 'string' ||
      consumedKey.current === location.key
    )
      return;
    consumedKey.current = location.key;
    setValue(state.workspaceQuestion);
    const remainingState = { ...state };
    delete remainingState.workspaceQuestion;
    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: remainingState,
    });
  }, [location, navigate, setValue]);
}
