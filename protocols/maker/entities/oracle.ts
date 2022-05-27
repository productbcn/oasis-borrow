import { observe } from 'blockchain/calls/observe'
import { pipHop, pipPeek, pipPeep, pipZzz } from 'blockchain/calls/osm'
import { ContextConnected } from 'blockchain/network'
import { createOraclePriceData$ } from 'blockchain/prices'
import { IBlocks } from 'interfaces/blockchain/IBlocks'
import { IContext } from 'interfaces/blockchain/IContext'
import { IOracle } from 'interfaces/protocols/IOracle'
import { memoize } from 'lodash'
import { Observable, of } from 'rxjs'
import { shareReplay, switchMap } from 'rxjs/operators'

import curry from 'ramda/src/curry'

export function oracle(context: IContext, blocks: IBlocks): IOracle {
  const context$ = context.context$
  const onEveryBlock$ = blocks()
  const oracleContext$ = context$.pipe(
    switchMap((ctx) => of({ ...ctx, account: ctx.mcdSpot.address })),
    shareReplay(1),
  ) as Observable<ContextConnected>

  const pipZzz$ = observe(onEveryBlock$, context$, pipZzz)
  const pipHop$ = observe(onEveryBlock$, context$, pipHop)
  const pipPeek$ = observe(onEveryBlock$, oracleContext$, pipPeek)
  const pipPeep$ = observe(onEveryBlock$, oracleContext$, pipPeep)

  const oraclePriceData$ = memoize(
    curry(createOraclePriceData$)(context$, pipPeek$, pipPeep$, pipZzz$, pipHop$),
  )

  return {
    getTokenPriceData$: (token: string) => oraclePriceData$(token),
  }
}
