import { atom, useAtom, useAtomValue } from 'jotai';

const toggleMap = atom(false);

export const useToggleMapValue = () => useAtomValue(toggleMap);
export const useToggleMap = () => useAtom(toggleMap);
