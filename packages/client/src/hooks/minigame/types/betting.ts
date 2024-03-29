import { PromiseOrValue } from 'contracts/types/ethers-contracts/common'

export type SETBETTINGTYPES = {
  playerId: PromiseOrValue<string> | string,
  locationId: PromiseOrValue<string> | string
}
