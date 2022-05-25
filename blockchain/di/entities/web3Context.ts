import { ContractDesc, createWeb3Context$, Web3Context } from '@oasisdex/web3-context'
import { IContext } from 'interfaces/IContext'
import { mapValues } from 'lodash'
import { Observable } from 'rxjs'

import { networksById } from '../../config'

export function web3Context$(): IContext<Observable<Web3Context>> {
  const chainIdToRpcUrl = mapValues(networksById, (network) => network.infuraUrl)
  const chainIdToDAIContractDesc: {
    [chainId: number]: ContractDesc
  } = mapValues(networksById, (network) => network.tokens.DAI)

  const [web3Context$, setupWeb3Context$] = createWeb3Context$(
    chainIdToRpcUrl,
    chainIdToDAIContractDesc,
  )

  return {
    create: () => {
      return web3Context$
    },
    connect: () => setupWeb3Context$(),
  }
}
