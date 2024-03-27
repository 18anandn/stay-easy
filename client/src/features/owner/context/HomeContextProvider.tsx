import { ReactNode, createContext, useState } from 'react';

type ContextType = {
  homeName?: string;
  setHomeName: (name: string) => void;
};

export const HomeContext = createContext<ContextType>({
  setHomeName: (name: string) => {},
});

type Props = {
  children?: ReactNode;
};

const HomeContextProvider: React.FC<Props> = ({ children }) => {
  const [homeName, setHomeName] = useState<string>();
  return (
    <HomeContext.Provider value={{ homeName, setHomeName }}>
      {children}
    </HomeContext.Provider>
  );
};

export default HomeContextProvider;
