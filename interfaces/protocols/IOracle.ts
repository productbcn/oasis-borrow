import { OraclePriceData } from 'blockchain/prices'
import { Observable } from 'rxjs'

export interface IOracle {
  getTokenPriceData$: (token: string) => Observable<OraclePriceData>
}
