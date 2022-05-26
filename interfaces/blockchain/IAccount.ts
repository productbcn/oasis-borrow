import { Observable } from 'rxjs'

export interface IAccount {
  get: () => Observable<string>
}
