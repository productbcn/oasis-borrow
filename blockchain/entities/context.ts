import { createContext$, createContextConnected$ } from 'blockchain/network'
import { IContext } from 'interfaces/blockchain/IContext'
import { IWeb3Context } from 'interfaces/blockchain/IWeb3Context'

export function context(web3Context: IWeb3Context): IContext {
  const context$ = createContext$(web3Context.connectedContext$)
  const connectedContext$ = createContextConnected$(context$)

  return {
    context$: context$,
    connectedContext$: connectedContext$,
  }
}
