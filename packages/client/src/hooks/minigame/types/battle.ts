import { PromiseOrValue } from 'contracts/types/ethers-contracts/common'

export type SETBATTLETYPES = {
  opponentId: PromiseOrValue<string>
}

export enum BattleOptions {
  NONE,
  Sword,
  Scroll,
  Potion
}

export type LOCKINTYPES = {
  hashSalt: PromiseOrValue<string>,
  options: PromiseOrValue<BattleOptions>
}

export type HashOptionsTypes = {
  key : string,
  data : string,
  timestamp : number
}
