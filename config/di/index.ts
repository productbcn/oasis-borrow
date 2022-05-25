import { rootContainerFactory } from 'blockchain/di'

const root = rootContainerFactory()

export const containers = {
  root,
  borrow: null,
  multiply: null,
  earn: null,
  overview: null,
}
