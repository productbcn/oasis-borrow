import BigNumber from 'bignumber.js'
import { IlkData } from 'blockchain/ilks'
import { Vault } from 'blockchain/vaults'
import { useAppContext } from 'components/AppContextProvider'
import { useSharedUI } from 'components/SharedUIProvider'
import { VaultFormContainer } from 'components/vault/VaultFormContainer'
import { CollateralPricesWithFilters } from 'features/collateralPrices/collateralPricesWithFilters'
import { accountIsConnectedValidator } from 'features/form/commonValidators'
import { BalanceInfo } from 'features/shared/balanceInfo'
import { VaultContainerSpinner, WithLoadingIndicator } from 'helpers/AppSpinner'
import { WithErrorHandler } from 'helpers/errorHandlers/WithErrorHandler'
import { useObservable } from 'helpers/observableHook'
import { useUIChanges } from 'helpers/uiChangesHook'
import { useFeatureToggle } from 'helpers/useFeatureToggle'
import { useTranslation } from 'next-i18next'
import React, { useEffect } from 'react'

import {
  AutomationFromKind,
  PROTECTION_MODE_CHANGE_SUBJECT,
  ProtectionModeChange,
} from '../common/UITypes/ProtectionFormModeChange'
import { TriggersData } from '../triggers/AutomationTriggersData'
import { AdjustSlFormControl } from './AdjustSlFormControl'
import { CancelSlFormControl } from './CancelSlFormControl'

interface Props {
  ilkData: IlkData
  automationTriggersData: TriggersData
  collateralPrices: CollateralPricesWithFilters
  vault: Vault
  collateralizationRatioAtNextPrice: BigNumber
  balanceInfo: BalanceInfo
  account?: string
}

export function ProtectionFormControl({
  ilkData,
  automationTriggersData,
  collateralPrices,
  vault,
  account,
  collateralizationRatioAtNextPrice,
  balanceInfo,
}: Props) {
  const { txHelpers$, context$, uiChanges } = useAppContext()
  const { t } = useTranslation()
  const { setVaultFormOpened } = useSharedUI()
  const isTouchDevice = window && 'ontouchstart' in window
  const newComponentsEnabled = useFeatureToggle('NewComponents')

  useEffect(() => {
    if (isTouchDevice && !automationTriggersData.isAutomationEnabled) {
      setVaultFormOpened(true)
    }
  }, [])

  const [txHelpers, txHelpersError] = useObservable(txHelpers$)
  const [context, contextError] = useObservable(context$)

  const [currentForm] = useUIChanges<ProtectionModeChange>(PROTECTION_MODE_CHANGE_SUBJECT)

  const accountIsConnected = accountIsConnectedValidator({ account })
  const accountIsController = accountIsConnected && account === vault.controller

  return (
    <WithErrorHandler error={[contextError, txHelpersError]}>
      <WithLoadingIndicator value={[context]} customLoader={<VaultContainerSpinner />}>
        {([context]) =>
          !newComponentsEnabled ? (
            <VaultFormContainer
              toggleTitle={
                automationTriggersData.isAutomationEnabled
                  ? t('protection.set-downside-protection')
                  : t('protection.edit-vault-protection')
              }
            >
              {currentForm?.currentMode === AutomationFromKind.CANCEL ? (
                <CancelSlFormControl
                  vault={vault}
                  ilkData={ilkData}
                  triggerData={automationTriggersData}
                  tx={txHelpers}
                  ctx={context}
                  accountIsController={accountIsController}
                  toggleForms={() => {
                    uiChanges.publish(PROTECTION_MODE_CHANGE_SUBJECT, {
                      currentMode: AutomationFromKind.ADJUST,
                      type: 'change-mode',
                    })
                  }}
                  collateralPrices={collateralPrices}
                  balanceInfo={balanceInfo}
                  collateralizationRatioAtNextPrice={collateralizationRatioAtNextPrice}
                />
              ) : (
                <AdjustSlFormControl
                  vault={vault}
                  collateralPrices={collateralPrices}
                  ilkData={ilkData}
                  triggerData={automationTriggersData}
                  tx={txHelpers}
                  ctx={context}
                  accountIsController={accountIsController}
                  collateralizationRatioAtNextPrice={collateralizationRatioAtNextPrice}
                  toggleForms={() => {
                    uiChanges.publish(PROTECTION_MODE_CHANGE_SUBJECT, {
                      type: 'change-mode',
                      currentMode: AutomationFromKind.CANCEL,
                    })
                  }}
                  balanceInfo={balanceInfo}
                />
              )}
            </VaultFormContainer>
          ) : currentForm?.currentMode === AutomationFromKind.CANCEL ? (
            <CancelSlFormControl
              vault={vault}
              ilkData={ilkData}
              triggerData={automationTriggersData}
              tx={txHelpers}
              ctx={context}
              accountIsController={accountIsController}
              toggleForms={() => {
                uiChanges.publish(PROTECTION_MODE_CHANGE_SUBJECT, {
                  currentMode: AutomationFromKind.ADJUST,
                  type: 'change-mode',
                })
              }}
              collateralPrices={collateralPrices}
              balanceInfo={balanceInfo}
              collateralizationRatioAtNextPrice={collateralizationRatioAtNextPrice}
            />
          ) : (
            <AdjustSlFormControl
              vault={vault}
              collateralPrices={collateralPrices}
              ilkData={ilkData}
              triggerData={automationTriggersData}
              tx={txHelpers}
              ctx={context}
              accountIsController={accountIsController}
              collateralizationRatioAtNextPrice={collateralizationRatioAtNextPrice}
              toggleForms={() => {
                uiChanges.publish(PROTECTION_MODE_CHANGE_SUBJECT, {
                  type: 'change-mode',
                  currentMode: AutomationFromKind.CANCEL,
                })
              }}
              balanceInfo={balanceInfo}
            />
          )
        }
      </WithLoadingIndicator>
    </WithErrorHandler>
  )
}
