import { atom, useAtom, useAtomValue } from 'jotai';

export const toggleMapAtom = atom(false);

export const useToggleMapValue = () => useAtomValue(toggleMapAtom);
export const useToggleMap = () => useAtom(toggleMapAtom);
