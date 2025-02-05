import React, {useEffect, useLayoutEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogBox, useColorScheme} from 'react-native';
import {palette} from '../theme';

export enum EThemeOption {
  'DARK' = 'DARK',
  'LIGHT' = 'LIGHT',
  'DEVICE' = 'DEVICE',
}

type TColorScheme = {
  primary: string;
  secondary: string;
  background: string;
  onBackground: string;
  error: string;
  success: string;
  warning: string;
  disabled: string;
  text: string;
  fullFillBtn: string;
  outLineBtn: string;
  border: string;
  buttonText: string;
  fullFillBtnText: string;
  default: string;
  none: string;
  dot: string;
  backgroundColorOnShadow: string;
  buttonSolid: string;
  textSolid: string;
  grayBackgroundColor: string;
};

export type TTHemeResult = {
  isDarkMode: boolean;
  colorScheme: TColorScheme;
  toggle: (input?: EThemeOption) => void;
  onDarkModeChange?: () => void;
};

const lightColorScheme: TColorScheme = {
  grayBackgroundColor: palette.gray2,
  primary: '#6200ee',
  secondary: '#03dac6',
  background: '#ffffff',
  onBackground: '#000000',
  error: '#b00020',
  success: '#00c853',
  warning: '#ffab00',
  disabled: '#0F0F0F',
  text: '#0F0F0F',
  fullFillBtn: '#0F0F0F',
  outLineBtn: '#FFFFFF',
  border: '#0F0F0F',
  buttonText: '#FFFFFF',
  fullFillBtnText: '#FFFFFF',
  default: '#F9F9F9F9',
  none: 'transparent',
  dot: palette.gray12,
  backgroundColorOnShadow: '#f1f1f1',
  buttonSolid: '#000',
  textSolid: '#ffffff',
};

const darkColorScheme: TColorScheme = {
  primary: '#bb86fc',
  secondary: '#03dac6',
  background: '#0F0F0F',
  onBackground: '#ffffff',
  error: '#cf6679',
  success: '#00c853',
  warning: '#ffab00',
  disabled: '#FFFFFF',
  text: '#FFFFFF',
  fullFillBtn: '#FFFFFF',
  outLineBtn: '#0F0F0F',
  border: '#FFFFFF',
  buttonText: '#0F0F0F',
  fullFillBtnText: '#0F0F0F',
  default: '#323232',
  none: 'transparent',
  dot: palette.gray20,
  backgroundColorOnShadow: '0f0f0f',
  buttonSolid: '#ffffff',
  textSolid: '#000000',
  grayBackgroundColor: palette.gray16,
};

var compareBoolean = (a: any): boolean => {
  return String(a) === 'true';
};

const useTheme = (): TTHemeResult => {
  const systemColorSchema = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const checkSettingSystem = async () => {
      const isAutoModeStr = await AsyncStorage.getItem('isAutoMode');
      const isAutoMode = compareBoolean(isAutoModeStr);

      if (isAutoMode) {
        setIsDarkMode(systemColorSchema === 'dark' ? true : false);
      } else {
        const storedIsDarkModeStr = await AsyncStorage.getItem('isDarkMode');

        if (storedIsDarkModeStr !== null) {
          setIsDarkMode(compareBoolean(storedIsDarkModeStr));
        } else {
          setIsDarkMode(false);
        }
      }
    };

    checkSettingSystem();
  }, []);
  const toggle = (input?: EThemeOption) => {
    if (input) {
      switch (input) {
        case EThemeOption.LIGHT: {
          setIsDarkMode(prev => false);
          AsyncStorage.setItem('isDarkMode', 'false');
          break;
        }
        case EThemeOption.DARK: {
          setIsDarkMode(prev => true);
          AsyncStorage.setItem('isDarkMode', 'true');
          break;
        }
        case EThemeOption.DEVICE: {
          setIsDarkMode(prev => {
            AsyncStorage.setItem(
              'isDarkMode',
              systemColorSchema ? 'true' : 'false',
            );
            return systemColorSchema === 'dark' ? true : false;
          });
          break;
        }
      }
    } else {
      setIsDarkMode(prev => {
        const newIsDarkMode = !prev;
        AsyncStorage.setItem('isDarkMode', String(newIsDarkMode));
        return newIsDarkMode;
      });
    }
  };

  const colorScheme = isDarkMode ? darkColorScheme : lightColorScheme;

  return {
    isDarkMode,
    colorScheme,
    toggle,
  };
};

export default useTheme;
