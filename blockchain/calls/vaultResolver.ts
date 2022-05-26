import BigNumber from 'bignumber.js'
import { charterIlks, cropJoinIlks } from 'blockchain/config'
import { IProxy } from 'interfaces/blockchain/IProxy'
import { combineLatest, Observable } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

export enum MakerVaultType {
  CHARTER = 'CHARTER',
  CROP_JOIN = 'CROP_JOIN',
  STANDARD = 'STANDARD',
}

export interface VaultResolve {
  ilk: string
  owner: string
  controller: string
  urnAddress: string
  type: MakerVaultType
}

export function createVaultResolver$(
  cdpToIlk$: (cdpId: BigNumber) => Observable<string>,
  cdpManagerUrns$: (cdpId: BigNumber) => Observable<string>,
  charterUrnProxy$: (usr: string) => Observable<string>,
  cropperUrnProxy$: (usr: string) => Observable<string>,
  cdpRegistryOwns$: (cdpId: BigNumber) => Observable<string>,
  cdpManagerOwner$: (cdpId: BigNumber) => Observable<string>,
  proxy: IProxy,
  cdpId: BigNumber,
): Observable<VaultResolve> {
  return cdpToIlk$(cdpId).pipe(
    switchMap((ilk) => {
      if (charterIlks.includes(ilk)) {
        return cdpRegistryOwns$(cdpId).pipe(
          switchMap((usr) =>
            combineLatest(charterUrnProxy$(usr), proxy.getProxyOwner$(usr)).pipe(
              map(([urnAddress, controller]) => ({
                ilk,
                owner: usr,
                controller,
                urnAddress,
                type: MakerVaultType.CHARTER,
              })),
            ),
          ),
        )
      }

      if (cropJoinIlks.includes(ilk)) {
        return cdpRegistryOwns$(cdpId).pipe(
          switchMap((usr) =>
            combineLatest(cropperUrnProxy$(usr), proxy.getProxyOwner$(usr)).pipe(
              map(([urnAddress, controller]) => ({
                ilk,
                owner: usr,
                controller,
                urnAddress,
                type: MakerVaultType.CROP_JOIN,
              })),
            ),
          ),
        )
      }

      return combineLatest(cdpManagerOwner$(cdpId), cdpManagerUrns$(cdpId)).pipe(
        switchMap(([owner, urnAddress]) =>
          proxy.getProxyOwner$(owner).pipe(
            map((controller) => ({
              ilk,
              owner,
              controller,
              urnAddress,
              type: MakerVaultType.STANDARD,
            })),
          ),
        ),
      )
    }),
  )
}
