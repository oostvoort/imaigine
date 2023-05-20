import { atom } from 'jotai'

export const activePage_atom = atom<"create" | "game" | "welcome" | "loading">("welcome")
