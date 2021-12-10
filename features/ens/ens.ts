import { ContextConnected } from '@oasisdex/transactions/lib/src/callHelpersContextParametrized'
import { Observable, of } from 'rxjs'
import { filter, map, switchMap, tap } from 'rxjs/operators'
import { provider } from 'web3-core'

export function createEnsName$(context$: Observable<ContextConnected>) {
  return context$.pipe(
    tap(() => console.log('createEnsName$')),
    switchMap((context) =>
      of(context).pipe(
        map((context) => context.web3.currentProvider),
        filter(
          (provider): provider is Exclude<provider, null | string> =>
            provider !== null && typeof provider === 'string',
        ),
        tap((provider) => console.log('provider', provider)),

        // switchMap((provider) => provider.lookupAddress(context.account)),
      ),
    ),
  )
}
