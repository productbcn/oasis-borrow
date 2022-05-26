import BigNumber from 'bignumber.js'
import { IProxy } from 'interfaces/blockchain/IProxy'
import isEqual from 'lodash/isEqual'
import { of } from 'ramda'
import { combineLatest, Observable } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators'

import { Context } from './network'

function filterSupportedIlksOnNetwork(joins: Record<string, string>, ilks: string[]): string[] {
  const supportedIlks = Object.keys(joins)
  return ilks.filter((ilk) => supportedIlks.includes(ilk))
}

export function createGetRegistryCdps$(
  onEveryBlock$: Observable<number>,
  context$: Observable<Context>,
  getRegistryCdp$: (arg: { ilk: string; usr: string }) => Observable<BigNumber | null>,
  proxy: IProxy,
  ilks: string[],
  address: string,
): Observable<BigNumber[]> {
  return combineLatest(onEveryBlock$, context$).pipe(
    switchMap(([_, { joins }]) =>
      proxy.getProxy$(address).pipe(
        switchMap((proxyAddress) => {
          if (proxyAddress === undefined) {
            return of([])
          }
          const supportedIlks = filterSupportedIlksOnNetwork(joins, ilks)

          if (supportedIlks.length === 0) {
            return of([])
          }

          return combineLatest(
            supportedIlks.map((ilk) => getRegistryCdp$({ ilk, usr: proxyAddress })),
          ).pipe(map((cdpids) => cdpids.filter((id) => id !== null)))
        }),
      ),
    ),
    distinctUntilChanged(isEqual),
    shareReplay(1),
  )
}
