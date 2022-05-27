import { createSend, SendFunction } from '@oasisdex/transactions'
import {
  AutomationBotAddTriggerData,
  AutomationBotRemoveTriggerData,
} from 'blockchain/calls/automationBot'
import {
  createSendTransaction,
  createSendWithGasConstraints,
  estimateGas,
  EstimateGasFunction,
  SendTransactionFunction,
  TransactionDef,
} from 'blockchain/calls/callsHelpers'
import { ApproveData, DisapproveData } from 'blockchain/calls/erc20'
import { CreateDsProxyData, SetProxyOwnerData } from 'blockchain/calls/proxy'
import {
  ClaimRewardData,
  DepositAndGenerateData,
  OpenData,
  WithdrawAndPaybackData,
} from 'blockchain/calls/proxyActions/adapters/ProxyActionsSmartContractAdapterInterface'
import {
  CloseGuniMultiplyData,
  CloseVaultData,
  MultiplyAdjustData,
  OpenGuniMultiplyData,
  OpenMultiplyData,
  ReclaimData,
} from 'blockchain/calls/proxyActions/proxyActions'
import { ContextConnected } from 'blockchain/network'
import { createGasPrice$, GasPriceParams, tokenPricesInUSD$ } from 'blockchain/prices'
import { createTransactionManager } from 'features/account/transactionManager'
import { doGasEstimation, HasGasEstimation } from 'helpers/form'
import { IAccount } from 'interfaces/blockchain/IAccount'
import { IBlocks } from 'interfaces/blockchain/IBlocks'
import { IContext } from 'interfaces/blockchain/IContext'
import { ITransactions } from 'interfaces/blockchain/ITransactions'
import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'

export type TxData =
  | OpenData
  | DepositAndGenerateData
  | WithdrawAndPaybackData
  | ApproveData
  | DisapproveData
  | CreateDsProxyData
  | SetProxyOwnerData
  | ReclaimData
  | OpenMultiplyData
  | MultiplyAdjustData
  | CloseVaultData
  | OpenGuniMultiplyData
  | AutomationBotAddTriggerData
  | AutomationBotRemoveTriggerData
  | CloseGuniMultiplyData
  | ClaimRewardData

export interface TxHelpers {
  send: SendTransactionFunction<TxData>
  sendWithGasEstimation: SendTransactionFunction<TxData>
  estimateGas: EstimateGasFunction<TxData>
}

export type AddGasEstimationFunction = <S extends HasGasEstimation>(
  state: S,
  call: (send: TxHelpers, state: S) => Observable<number> | undefined,
) => Observable<S>

export type TxHelpers$ = Observable<TxHelpers>

export const protoTxHelpers: TxHelpers = {
  send: () => null as any,
  sendWithGasEstimation: () => null as any,
  estimateGas: () => null as any,
}

export function createTxHelpers$(
  context$: Observable<ContextConnected>,
  send: SendFunction<TxData>,
  gasPrice$: Observable<GasPriceParams>,
): TxHelpers$ {
  return context$.pipe(
    filter(({ status }) => status === 'connected'),
    map((context) => ({
      send: createSendTransaction(send, context),
      sendWithGasEstimation: createSendWithGasConstraints(send, context, gasPrice$),
      estimateGas: <B extends TxData>(def: TransactionDef<B>, args: B): Observable<number> => {
        return estimateGas(context, def, args)
      },
    })),
  )
}

export function transactions(context: IContext, account: IAccount, blocks: IBlocks): ITransactions {
  const onEveryBlock$ = blocks()
  const initializedAccount$ = account()
  const connectedContext$ = context.connectedContext$
  const context$ = context.context$

  const [send, transactions$] = createSend<TxData>(
    initializedAccount$,
    onEveryBlock$,
    context.connectedContext$,
  )

  const gasPrice$ = createGasPrice$(onEveryBlock$, context$)

  const txHelpers$: TxHelpers$ = createTxHelpers$(connectedContext$, send, gasPrice$)
  const transactionManager$ = createTransactionManager(transactions$)

  function addGasEstimation$<S extends HasGasEstimation>(
    state: S,
    call: (send: TxHelpers, state: S) => Observable<number> | undefined,
  ): Observable<S> {
    return doGasEstimation(gasPrice$, tokenPricesInUSD$, txHelpers$, state, call)
  }

  return {
    getGasEstimate$: addGasEstimation$,
    getHelpers$: () => txHelpers$,
    getManager$: () => transactionManager$,
  }
}
