import BigNumber from 'bignumber.js'
import { IlkData } from 'blockchain/ilks'
import { ContextConnected } from 'blockchain/network'
import { TxHelpers } from 'components/AppContext'
import { Observable } from 'rxjs'
import { BalanceInfo } from './balanceInfo'
import { PriceInfo } from './priceInfo'

export type GenericOpenVaultContext = {
  proxyAddress: string | undefined
  token: string
  allowance: BigNumber
  priceInfo: PriceInfo
  balanceInfo: BalanceInfo
  ilkData: IlkData
  context: ContextConnected
  ilk: string
  priceInfo$: (token: string) => Observable<PriceInfo>
  balanceInfo$: (token: string, address: string | undefined) => Observable<BalanceInfo>
  proxyAddress$: (address: string) => Observable<string | undefined>
  ilkData$: (ilk: string) => Observable<IlkData>
  txHelpers: TxHelpers
}
