import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const hoveredHomeAtom = atom<string | null>(null);
export const useGetHoveredHome = () => useAtomValue(hoveredHomeAtom);
export const useSetHoveredHome = () => useSetAtom(hoveredHomeAtom);
export const useHoveredHome = () => useAtom(hoveredHomeAtom);
