import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

type TCountdownParams = {
  initialDuration: number;
  isStartImmediately: boolean;
};

type TCountdownResult = {
  value: number;
  isRunning: boolean;
  start: () => void;
  intervalId?: NodeJS.Timeout;
};

const useCountDown = (
  initialDuration = 0,
  isStartImmediately = false,
): TCountdownResult => {
  const [value, setValue] = useState(initialDuration);
  const valueInAppInactive = useRef<number>(0);
  const [isRunning, setIsRunning] = useState(isStartImmediately);
  const appState = useRef(AppState.currentState);
  const backgroundStartTime = useRef<Date | null>(null);
  const intervalId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {};
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus): void => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (backgroundStartTime.current) {
        const timeInSeconds = Math.round(
          (new Date().getTime() - backgroundStartTime.current.getTime()) / 1000,
        );
        setValue(prevValue => {
          const newValue = prevValue - timeInSeconds;
          if (newValue <= 0) {
            clearInterval(intervalId.current);
            setIsRunning(false);
            return 0;
          }
          return newValue;
        });
        backgroundStartTime.current = null; // Reset thời gian nền
      }
    } else if (nextAppState.match(/inactive|background/)) {
      backgroundStartTime.current = new Date();
    }
    appState.current = nextAppState;
  };

  const countDown = () => {
    intervalId.current = setInterval(() => {
      setValue(prev => {
        valueInAppInactive.current = prev;
        if (prev === 0) {
          clearInterval(intervalId.current);
          setIsRunning(false);
        }
        return prev > 0 ? prev - 1 : (prev = 0);
      });
    }, 1000);
  };

  useEffect(() => {
    if (isRunning) countDown();
    return () => {
      clearInterval(intervalId.current);
    };
  }, [isRunning]);

  const start = (input?: number): void => {
    clearInterval(intervalId.current);
    setIsRunning(prev => {
      setValue(input || initialDuration);
      countDown();
      return true;
    });
  };

  return {
    value,
    isRunning,
    start,
    intervalId: intervalId.current,
  };
};

export default useCountDown;
