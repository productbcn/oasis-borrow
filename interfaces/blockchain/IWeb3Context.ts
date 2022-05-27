import {
  Web3Context,
  Web3ContextConnected,
  Web3ContextConnectedReadonly,
} from '@oasisdex/web3-context'
import { Observable } from 'rxjs'

export interface IWeb3Context {
  context$: Observable<Web3Context>
  connectedContext$: Observable<Web3ContextConnectedReadonly | Web3ContextConnected>
  connect$: () => void
}
