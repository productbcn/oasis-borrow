import { OraclePriceData } from 'blockchain/prices'
import { IOracle } from 'interfaces/protocols/IOracle'
import { combineLatest, Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import {
  CollateralPricesWithFilters,
  collateralPricesWithFilters$,
} from './collateralPricesWithFilters'

export type CollateralPrice = OraclePriceData & { token: string }
export type CollateralPrices = CollateralPrice[]

export function createCollateralPrices$(
  collateralTokens: Observable<string[]>,
  oracle: IOracle,
): Observable<CollateralPricesWithFilters> {
  return collateralTokens.pipe(
    switchMap((collateralTokens) =>
      combineLatest(
        ...collateralTokens.map((token) =>
          oracle
            .getTokenPriceData$(token)
            .pipe(switchMap((oraclePriceData) => of({ ...oraclePriceData, token }))),
        ),
      ).pipe(switchMap((collateralPrices) => collateralPricesWithFilters$(collateralPrices))),
    ),
  )
}
