import { blockchainContainerFactory } from 'blockchain/di'

const root = blockchainContainerFactory()

export const containers = {
  root,
  borrow: null,
  multiply: null,
  earn: null,
  overview: null,
}
