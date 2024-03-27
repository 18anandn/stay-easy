import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ScopeProvider } from 'jotai-scope';
import { ReactNode } from 'react';

const homeNameAtom = atom<string | null>(null);

type Props = {
  children: ReactNode;
};

export const HomeProvider: React.FC<Props> = ({ children }) => {
  return <ScopeProvider atoms={[homeNameAtom]}>{children}</ScopeProvider>;
};

export const useHomeName = () => useAtomValue(homeNameAtom);
export const useSetHomeName = () => useSetAtom(homeNameAtom);
