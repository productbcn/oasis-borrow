import { trackingEvents } from 'analytics/analytics'
import { mixpanelIdentify } from 'analytics/mixpanel'
import { ContextConnected, createAccount$, createInitializedAccount$ } from 'blockchain/network'
import { IAccount } from 'interfaces/blockchain/IAccount'
import { IContext } from 'interfaces/blockchain/IContext'
import { IWeb3Context } from 'interfaces/blockchain/IWeb3Context'
import { isEqual } from 'lodash'
import { combineLatest, Observable, of } from 'rxjs'
import { distinctUntilChanged, mergeMap } from 'rxjs/operators'

function trackEvents(
  initializedAccount$: Observable<string>,
  connectedContext$: Observable<ContextConnected>,
) {
  combineLatest(initializedAccount$, connectedContext$)
    .pipe(
      mergeMap(([account, network]) => {
        return of({
          networkName: network.name,
          connectionKind: network.connectionKind,
          account: account?.toLowerCase(),
        })
      }),
      distinctUntilChanged(isEqual),
    )
    .subscribe(({ account, networkName, connectionKind }) => {
      if (account) {
        mixpanelIdentify(account, { walletType: connectionKind })
        trackingEvents.accountChange(account, networkName, connectionKind)
      }
    })
}

export function account$(web3Context: IWeb3Context, context: IContext): IAccount {
  const account$ = createAccount$(web3Context.get())
  const initializedAccount$ = createInitializedAccount$(account$)

  trackEvents(initializedAccount$, context.getConnected())

  return {
    get: () => initializedAccount$,
  }
}
