import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

const formModalAtom = atom(false);

export const useGetFormModalStatus = () => useAtomValue(formModalAtom);
export const useSetFormModalStatus = () => useSetAtom(formModalAtom);
export const useFormModalStatus = () => useAtom(formModalAtom);
