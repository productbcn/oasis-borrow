import { Observable } from 'rxjs'

export interface IBlocks {
  get: () => Observable<number>
}
