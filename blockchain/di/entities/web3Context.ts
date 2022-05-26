import { ContractDesc, createWeb3Context$ } from '@oasisdex/web3-context'
import { createWeb3ContextConnected$ } from 'blockchain/network'
import { IWeb3Context } from 'interfaces/blockchain/IWeb3Context'
import { mapValues } from 'lodash'

import { networksById } from '../../config'

export function web3Context$(): IWeb3Context {
  const chainIdToRpcUrl = mapValues(networksById, (network) => network.infuraUrl)
  const chainIdToDAIContractDesc: {
    [chainId: number]: ContractDesc
  } = mapValues(networksById, (network) => network.tokens.DAI)

  const [web3Context$, setupWeb3Context$] = createWeb3Context$(
    chainIdToRpcUrl,
    chainIdToDAIContractDesc,
  )

  const web3ContextConnected$ = createWeb3ContextConnected$(web3Context$)

  return {
    get: () => web3Context$,
    getConnected: () => web3ContextConnected$,
    connect: () => setupWeb3Context$(),
  }
}
