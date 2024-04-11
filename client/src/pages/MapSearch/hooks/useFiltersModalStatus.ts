import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

const filterModalAtom = atom(false);

export const useSetFiltersModalStatus = () => useSetAtom(filterModalAtom);
export const useGetFiltersModalStatus = () => useAtomValue(filterModalAtom);
export const useFiltersModalStatus = () => useAtom(filterModalAtom);
