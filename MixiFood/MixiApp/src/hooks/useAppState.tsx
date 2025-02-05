import {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export const useAppState = () => {
  const [state, setState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const unsub = AppState.addEventListener('change', setState);
    return unsub.remove;
  }, []);

  return {state};
};
