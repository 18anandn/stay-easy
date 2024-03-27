import { ReactNode, createContext, useState } from 'react';

type ContextType = {
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MenuContext = createContext<ContextType>({
  isSideMenuOpen: false,
  setIsSideMenuOpen: () => {},
});

type Props = {
  children?: ReactNode;
};

const MenuContextProvider: React.FC<Props> = ({ children }) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  
  return (
    <MenuContext.Provider value={{ isSideMenuOpen, setIsSideMenuOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContextProvider;
