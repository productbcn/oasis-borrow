import { Context, ContextConnected } from 'blockchain/network'
import { Observable } from 'rxjs'

export interface IContext {
  get$: (account?: string) => Observable<Context>
  getConnected$: () => Observable<ContextConnected>
}
