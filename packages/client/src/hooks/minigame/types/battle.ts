import { PromiseOrValue } from 'contracts/types/ethers-contracts/common'

export type SETBATTLETYPES = {
  opponentId: PromiseOrValue<string>
}

export enum BATTLE_OUTCOME {
  'You Win!' = 1,
  'You Lost!' = 2,
  'Draw' = 3
}

export enum BATTLE_OPTIONS {
  NONE,
  Sword,
  Scroll,
  Potion
}

export enum BATTLE_STATUS {
  NOT_IN_BATTLE,
  IN_BATTLE,
  DONE_SELECTING,
  LOCKED_IN
}

export type LOCKINTYPES = {
  hashSalt: PromiseOrValue<string>,
  options: PromiseOrValue<BATTLE_OPTIONS>
}

export type HashOptionsTypes = {
  key : string,
  data : BATTLE_OPTIONS,
  timestamp : number
}
