import { createOnEveryBlock$ } from 'blockchain/network'
import { IBlocks } from 'interfaces/blockchain/IBlocks'
import { IWeb3Context } from 'interfaces/blockchain/IWeb3Context'

export function blocks$(web3Context: IWeb3Context): IBlocks {
  const [onEveryBlock$] = createOnEveryBlock$(web3Context.connectedContext$)

  return () => onEveryBlock$
}
