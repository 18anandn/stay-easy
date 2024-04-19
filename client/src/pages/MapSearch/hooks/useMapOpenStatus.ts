import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const mapOpenAtom = atom(false);

export const useGetMapOpenStatus = () => useAtomValue(mapOpenAtom);
export const useSetMapOpenStatus = () => useSetAtom(mapOpenAtom);
export const useMapStatus = () => useAtom(mapOpenAtom);
