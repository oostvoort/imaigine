import { PromiseOrValue } from 'contracts/types/ethers-contracts/common'

export type SETBATTLETYPES = {
  playerId: PromiseOrValue<string>,
  locationId: PromiseOrValue<string>,
  opponentId: PromiseOrValue<string>
}
