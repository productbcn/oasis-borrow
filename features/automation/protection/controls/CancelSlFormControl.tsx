import { TxState, TxStatus } from '@oasisdex/transactions'
import { amountFromWei } from '@oasisdex/utils'
import BigNumber from 'bignumber.js'
import {
  AutomationBotRemoveTriggerData,
  removeAutomationBotTrigger,
} from 'blockchain/calls/automationBot'
import { TxMetaKind } from 'blockchain/calls/txMeta'
import { IlkData } from 'blockchain/ilks'
import { Context } from 'blockchain/network'
import { Vault } from 'blockchain/vaults'
import { TxHelpers } from 'components/AppContext'
import { useAppContext } from 'components/AppContextProvider'
import { RetryableLoadingButtonProps } from 'components/dumb/RetryableLoadingButton'
import {
  failedStatuses,
  progressStatuses,
} from 'features/automation/protection/common/consts/txStatues'
import {
  ADD_FORM_CHANGE,
  AddFormChange,
} from 'features/automation/protection/common/UITypes/AddFormChange'
import { SidebarCancelStopLoss } from 'features/automation/protection/controls/sidebar/SidebarCancelStopLoss'
import { CollateralPricesWithFilters } from 'features/collateralPrices/collateralPricesWithFilters'
import { BalanceInfo } from 'features/shared/balanceInfo'
import { GasEstimationStatus, HasGasEstimation } from 'helpers/form'
import { useObservable } from 'helpers/observableHook'
import { useUIChanges } from 'helpers/uiChangesHook'
import { useFeatureToggle } from 'helpers/useFeatureToggle'
import { zero } from 'helpers/zero'
import React, { useMemo } from 'react'

import { transactionStateHandler } from '../common/AutomationTransactionPlunger'
import { extractStopLossData, prepareTriggerData } from '../common/StopLossTriggerDataExtractor'
import { REMOVE_FORM_CHANGE, RemoveFormChange } from '../common/UITypes/RemoveFormChange'
import { TriggersData } from '../triggers/AutomationTriggersData'
import { CancelSlFormLayout, CancelSlFormLayoutProps } from './CancelSlFormLayout'

function prepareRemoveTriggerData(
  vaultData: Vault,
  triggerId: number,
  removeAllowance: boolean,
): AutomationBotRemoveTriggerData {
  const baseTriggerData = prepareTriggerData(vaultData, false, new BigNumber(0))

  return {
    ...baseTriggerData,
    kind: TxMetaKind.removeTrigger,
    triggerId,
    removeAllowance,
  }
}

interface CancelSlFormControlProps {
  vault: Vault
  ilkData: IlkData
  triggerData: TriggersData
  ctx: Context
  toggleForms: () => void
  accountIsController: boolean
  collateralPrices: CollateralPricesWithFilters
  balanceInfo: BalanceInfo
  collateralizationRatioAtNextPrice: BigNumber
  tx?: TxHelpers
}

export function CancelSlFormControl({
  vault,
  triggerData,
  ctx,
  toggleForms,
  accountIsController,
  collateralPrices,
  balanceInfo,
  ilkData,
  collateralizationRatioAtNextPrice,
  tx,
}: CancelSlFormControlProps) {
  const { triggerId, isStopLossEnabled } = extractStopLossData(triggerData)
  const { addGasEstimation$, uiChanges } = useAppContext()
  const [uiState] = useUIChanges<RemoveFormChange>(REMOVE_FORM_CHANGE)
  const [addSlUiState] = useUIChanges<AddFormChange>(ADD_FORM_CHANGE)
  // TODO: if there will be no existing triggers left after removal, allowance should be set to true
  const removeAllowance = false
  const txData = useMemo(() => prepareRemoveTriggerData(vault, triggerId, removeAllowance), [
    triggerId,
  ])

  const gasEstimationData$ = useMemo(() => {
    return addGasEstimation$(
      { gasEstimationStatus: GasEstimationStatus.unset },
      ({ estimateGas }) => estimateGas(removeAutomationBotTrigger, txData),
    )
  }, [txData])

  const [gasEstimationData] = useObservable(gasEstimationData$)

  const isOwner = ctx.status === 'connected' && ctx.account === vault.controller

  const removeTriggerConfig: RetryableLoadingButtonProps = {
    translationKey: 'cancel-stop-loss',
    onClick: (finishLoader: (succeded: boolean) => void) => {
      if (tx === undefined) {
        return
      }
      const txSendSuccessHandler = (transactionState: TxState<AutomationBotRemoveTriggerData>) =>
        transactionStateHandler(
          (transactionState) => {
            const successTx =
              transactionState.status === TxStatus.Success ||
              transactionState.status === TxStatus.Failure

            const gasUsed = successTx
              ? new BigNumber((transactionState as any).receipt.gasUsed)
              : zero
            const effectiveGasPrice = successTx
              ? new BigNumber((transactionState as any).receipt.effectiveGasPrice)
              : zero
            const totalCost =
              !gasUsed.eq(0) && !effectiveGasPrice.eq(0)
                ? amountFromWei(gasUsed.multipliedBy(effectiveGasPrice)).multipliedBy(tokenPrice)
                : zero

            uiChanges.publish(REMOVE_FORM_CHANGE, {
              type: 'tx-details',
              txDetails: {
                txHash: (transactionState as any).txHash,
                txStatus: transactionState.status,
                txError:
                  transactionState.status === TxStatus.Error ? transactionState.error : undefined,
                totalCost,
              },
            })
          },
          transactionState,
          finishLoader,
          waitForTx,
        )

      const sendTxErrorHandler = () => {
        finishLoader(false)
      }

      // TODO circular dependency waitForTx <-> txSendSuccessHandler
      const waitForTx = tx
        .sendWithGasEstimation(removeAutomationBotTrigger, txData)
        .subscribe(txSendSuccessHandler, sendTxErrorHandler)
    },
    isLoading: false,
    isRetry: false,
    disabled: !isOwner,
    isStopLossEnabled,
  }

  const txStatus = uiState?.txDetails?.txStatus
  const isFailureStage = txStatus && failedStatuses.includes(txStatus)
  const isProgressStage = txStatus && progressStatuses.includes(txStatus)
  const isSuccessStage = txStatus === TxStatus.Success

  const stage = isSuccessStage
    ? 'txSuccess'
    : isProgressStage
    ? 'txInProgress'
    : isFailureStage
    ? 'txFailure'
    : 'editing'

  const isProgressDisabled = !!(!isOwner || isProgressStage)

  const { token } = vault
  const tokenPrice = collateralPrices.data.find((x) => x.token === token)?.currentPrice!
  const ethPrice = collateralPrices.data.find((x) => x.token === 'ETH')?.currentPrice!
  const etherscan = ctx.etherscan.url

  const gasEstimationUsd =
    gasEstimationData && (gasEstimationData as HasGasEstimation).gasEstimationUsd

  const props: CancelSlFormLayoutProps = {
    liquidationPrice: vault.liquidationPrice,
    tokenPrice,
    removeTriggerConfig: removeTriggerConfig,
    txState: uiState?.txDetails?.txStatus,
    txHash: uiState?.txDetails?.txHash,
    txError: uiState?.txDetails?.txError,
    gasEstimation: gasEstimationData as HasGasEstimation,
    gasEstimationUsd: gasEstimationUsd,
    accountIsController,
    actualCancelTxCost: uiState?.txDetails?.totalCost,
    toggleForms,
    etherscan,
    ethPrice,
    ethBalance: balanceInfo.ethBalance,
    stage,
    token,
    ilkData,
    collateralizationRatioAtNextPrice,
    selectedSLValue: addSlUiState.selectedSLValue,
    isProgressDisabled,
  }

  const newComponentsEnabled = useFeatureToggle('NewComponents')

  return newComponentsEnabled ? (
    <SidebarCancelStopLoss {...props} />
  ) : (
    <CancelSlFormLayout {...props} />
  )
}
