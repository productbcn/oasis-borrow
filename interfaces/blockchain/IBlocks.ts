import { Observable } from 'rxjs'

export interface IBlocks {
  (): Observable<number>
}
