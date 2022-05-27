import { Context, ContextConnected } from 'blockchain/network'
import { Observable } from 'rxjs'

export interface IContext {
  context$: Observable<Context>
  connectedContext$: Observable<ContextConnected>
}
