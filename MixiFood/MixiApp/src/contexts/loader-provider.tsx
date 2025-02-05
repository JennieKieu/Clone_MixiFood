import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  ELoaderType,
  LoaderContent,
  TLoaderContentProps,
} from '../components/AppLoader';
import {useTheme} from '@rneui/themed';
import {palette} from '../theme';

type TLoaderContext = {
  isVisible: boolean;
  show: (loaderType?: ELoaderType) => void;
  hide: () => void;
};

const defaultValue: TLoaderContext = {
  isVisible: false,
  show: (loaderType = ELoaderType.default) => {},
  hide: () => {},
};

const context = React.createContext<TLoaderContext>(defaultValue);
const useLoader = () => useContext(context);

type TLoaderProviderProps = {
  loaderProps?: Omit<TLoaderContentProps, 'visible'>;
} & PropsWithChildren;

const LoaderProvider: React.FC<TLoaderProviderProps> = props => {
  const {children, loaderProps} = props;
  const {Provider} = context;
  const {theme} = useTheme();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loaderType, setLoaderType] = useState<ELoaderType>(
    ELoaderType.default,
  );

  const show = useCallback((loaderTypee?: ELoaderType) => {
    setIsVisible(true);
    loaderTypee
      ? setLoaderType(loaderTypee)
      : setLoaderType(ELoaderType.default);
  }, []);
  const hide = useCallback(() => setIsVisible(false), []);

  return (
    <Provider value={{isVisible, show, hide}}>
      {children}
      <LoaderContent
        {...loaderProps}
        loaderColor={theme.mode === 'dark' ? palette.white : undefined}
        backdropColor={theme.mode === 'dark' ? palette.white : undefined}
        visible={isVisible}
        loaderType={loaderType}
      />
    </Provider>
  );
};

export {useLoader, LoaderProvider};
