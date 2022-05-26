import {
  Web3Context,
  Web3ContextConnected,
  Web3ContextConnectedReadonly,
} from '@oasisdex/web3-context'
import { Observable } from 'rxjs'

export interface IWeb3Context {
  get$: () => Observable<Web3Context>
  getConnected$: () => Observable<Web3ContextConnectedReadonly | Web3ContextConnected>
  connect$: () => void
}
