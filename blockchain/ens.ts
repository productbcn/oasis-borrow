import { ethers } from 'ethers'
import { IContext } from 'interfaces/blockchain/IContext'
import { switchMap } from 'rxjs/operators'

export function resolveENSName$(context: IContext, address: string) {
  return context.get$().pipe(
    switchMap(async (context) => {
      const provider = new ethers.providers.JsonRpcProvider(context.infuraUrl)
      return await provider
        .lookupAddress(address)
        .catch((err: Error) =>
          console.warn(`Error looking up ENS name for address: ${err.message}`),
        )
    }),
  )
}
