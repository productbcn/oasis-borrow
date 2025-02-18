import { useAppContext } from 'components/AppContextProvider'
import { SidebarSection, SidebarSectionProps } from 'components/sidebar/SidebarSection'
import { VaultErrors } from 'components/vault/VaultErrors'
import { VaultWarnings } from 'components/vault/VaultWarnings'
import { backToVaultOverview } from 'features/automation/protection/common/helpers'
import {
  errorsValidation,
  warningsValidation,
} from 'features/automation/protection/common/validation'
import {
  AdjustSlFormLayoutProps,
  slCollRatioNearLiquidationRatio,
} from 'features/automation/protection/controls/AdjustSlFormLayout'
import { getPrimaryButtonLabel } from 'features/sidebar/getPrimaryButtonLabel'
import { getSidebarStatus } from 'features/sidebar/getSidebarStatus'
import { getSidebarTitle } from 'features/sidebar/getSidebarTitle'
import { extractSidebarTxData } from 'helpers/extractSidebarHelpers'
import { useFeatureToggle } from 'helpers/useFeatureToggle'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { Grid, Text } from 'theme-ui'

import { SidebarAdjustStopLossAddStage } from './SidebarAdjustStopLossAddStage'
import { SidebarAdjustStopLossEditingStage } from './SidebarAdjustStopLossEditingStage'

export function SidebarAdjustStopLoss(props: AdjustSlFormLayoutProps) {
  const { t } = useTranslation()
  const { uiChanges } = useAppContext()
  const stopLossWriteEnabled = useFeatureToggle('StopLossWrite')

  const {
    addTriggerConfig,
    collateralizationRatioAtNextPrice,
    ethBalance,
    ethPrice,
    firstStopLossSetup,
    gasEstimationUsd,
    ilkData,
    isProgressDisabled,
    redirectToCloseVault,
    selectedSLValue,
    stage,
    toggleForms,
    token,
    txError,
  } = props

  const flow = firstStopLossSetup ? 'addSl' : 'adjustSl'
  const errors = errorsValidation({ txError, selectedSLValue, ilkData })
  const warnings = warningsValidation({
    token,
    gasEstimationUsd,
    ethBalance,
    ethPrice,
    selectedSLValue,
    collateralizationRatioAtNextPrice,
  })
  const sidebarTxData = extractSidebarTxData(props)
  const shouldRedirectToCloseVault = slCollRatioNearLiquidationRatio(selectedSLValue, ilkData)

  const sidebarSectionProps: SidebarSectionProps = {
    title: getSidebarTitle({ flow, stage, token }),
    content: (
      <Grid gap={3}>
        {stopLossWriteEnabled ? (
          <>
            {(stage === 'stopLossEditing' || stage === 'txFailure') && (
              <SidebarAdjustStopLossEditingStage {...props} />
            )}
          </>
        ) : (
          <Text as="p" variant="paragraph3" sx={{ color: 'lavender' }}>
            Due to extreme adversarial market conditions we have currently disabled setting up new
            stop loss triggers, as they might not result in the expected outcome for our users.
            Please use the 'close vault' option if you want to close your vault right now.
          </Text>
        )}
        {(stage === 'txSuccess' || stage === 'txInProgress') && (
          <SidebarAdjustStopLossAddStage {...props} />
        )}
        {stage === 'stopLossEditing' && !selectedSLValue.isZero() && stopLossWriteEnabled && (
          <>
            <VaultErrors errorMessages={errors} ilkData={ilkData} />
            <VaultWarnings warningMessages={warnings} ilkData={ilkData} />
          </>
        )}
      </Grid>
    ),
    primaryButton: {
      label: getPrimaryButtonLabel({ flow, stage, token, shouldRedirectToCloseVault }),
      disabled: isProgressDisabled,
      isLoading: stage === 'txInProgress',
      action: () => {
        if (shouldRedirectToCloseVault) {
          redirectToCloseVault()
          return
        }
        if (stage !== 'txSuccess') addTriggerConfig.onClick(() => null)
        else backToVaultOverview(uiChanges)
      },
    },
    ...(!firstStopLossSetup &&
      stage !== 'txInProgress' && {
        textButton: {
          label: t('protection.navigate-cancel'),
          hidden: firstStopLossSetup,
          action: () => toggleForms(),
        },
      }),
    status: getSidebarStatus({ flow, ...sidebarTxData }),
  }

  return <SidebarSection {...sidebarSectionProps} />
}
