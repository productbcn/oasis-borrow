import { createAccount$, createInitializedAccount$ } from 'blockchain/network'
import { IAccount } from 'interfaces/blockchain/IAccount'
import { IWeb3Context } from 'interfaces/blockchain/IWeb3Context'

export function account$(web3Context: IWeb3Context): IAccount {
  const account$ = createAccount$(web3Context.get())
  const initializedAccount$ = createInitializedAccount$(account$)

  return {
    get: () => initializedAccount$,
  }
}
