import { createContext$, createContextConnected$ } from 'blockchain/network'
import { IContext } from 'interfaces/blockchain/IContext'
import { IWeb3Context } from 'interfaces/blockchain/IWeb3Context'

export function context(web3Context: IWeb3Context): IContext {
  const context$ = createContext$(web3Context.getConnected$())
  const connectedContext$ = createContextConnected$(context$)

  return {
    get$: () => context$,
    getConnected$: () => connectedContext$,
  }
}
