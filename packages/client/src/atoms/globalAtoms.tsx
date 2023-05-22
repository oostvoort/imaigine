import { atom } from 'jotai'

// indicator of what page to render to the client
export const activePage_atom = atom<"create" | "game" | "welcome" | "loading" | "dev">("game")
