import { Observable } from 'rxjs'

export interface IAccount {
  (): Observable<string>
}
