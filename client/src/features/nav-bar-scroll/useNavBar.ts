import { atom, useAtom, useAtomValue } from 'jotai';

const navBarIsOpenAtom = atom(true);

export const useNavBarIsOpen = () => useAtomValue(navBarIsOpenAtom);
export const useNavBar = () => useAtom(navBarIsOpenAtom);
