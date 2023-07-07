import { PromiseOrValue } from 'contracts/types/ethers-contracts/common'

export type SETBETTINGTYPES = {
  playerId: PromiseOrValue<string>,
  locationId: PromiseOrValue<string>,
  hashOption: PromiseOrValue<string>
}
