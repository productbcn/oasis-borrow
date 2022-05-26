import { Observable } from 'rxjs'

export interface IProxy {
  getProxy$: (account: string) => Observable<string | undefined>
  getProxyOwner$: (proxyAddress: string) => Observable<string>
}
