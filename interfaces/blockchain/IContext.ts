import { Context, ContextConnected } from 'blockchain/network'
import { Observable } from 'rxjs'

export interface IContext {
  get: () => Observable<Context>
  getConnected: () => Observable<ContextConnected>
}
