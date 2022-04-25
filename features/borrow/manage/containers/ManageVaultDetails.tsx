import { getToken } from 'blockchain/tokensMetadata'
import { useAppContext } from 'components/AppContextProvider'
import { DetailsSection } from 'components/DetailsSection'
import {
  DetailsSectionContentCardWrapper,
  getChangeVariant,
} from 'components/DetailsSectionContentCard'
import { DetailsSectionFooterItemWrapper } from 'components/DetailsSectionFooterItem'
import { VaultDetailsCardCollateralLocked } from 'components/vault/detailsCards/VaultDetailsCardCollateralLocked'
import { VaultDetailsCardCollateralizationRatio } from 'components/vault/detailsCards/VaultDetailsCardCollaterlizationRatio'
import { VaultDetailsCardCurrentPrice } from 'components/vault/detailsCards/VaultDetailsCardCurrentPrice'
import { VaultDetailsCardLiquidationPrice } from 'components/vault/detailsCards/VaultDetailsCardLiquidationPrice'
import { BorrowFooterItems } from 'components/vault/detailsSection/BorrowFooterItems'
import { ContentCardCollateralizationRatio } from 'components/vault/detailsSection/ContentCardCollateralizationRatio'
import { ContentCardCollateralLocked } from 'components/vault/detailsSection/ContentCardCollateralLocked'
import { ContentCardLiquidationPrice } from 'components/vault/detailsSection/ContentCardLiquidationPrice'
import { SetupBanner, setupBannerGradientPresets } from 'components/vault/SetupBanner'
import {
  AfterPillProps,
  getAfterPillColors,
  getCollRatioColor,
  VaultDetailsSummaryContainer,
  VaultDetailsSummaryItem,
} from 'components/vault/VaultDetails'
import { VaultViewMode } from 'components/VaultTabSwitch'
import { TAB_CHANGE_SUBJECT } from 'features/automation/protection/common/UITypes/TabChange'
import { formatAmount } from 'helpers/formatters/format'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { Box, Grid } from 'theme-ui'

import { useFeatureToggle } from '../../../../helpers/useFeatureToggle'
import { GetProtectionBannerControl } from '../../../automation/protection/controls/GetProtectionBannerControl'
import { StopLossBannerControl } from '../../../automation/protection/controls/StopLossBannerControl'
import { StopLossTriggeredBannerControl } from '../../../automation/protection/controls/StopLossTriggeredBannerControl'
import { ManageStandardBorrowVaultState } from '../pipes/manageVault'

export function ManageVaultDetailsSummary({
  vault: { debt, token, freeCollateral, daiYieldFromLockedCollateral },
  afterDebt,
  afterFreeCollateral,
  daiYieldFromTotalCollateral,
  afterPillColors,
  showAfterPill,
}: ManageStandardBorrowVaultState & AfterPillProps) {
  const { t } = useTranslation()
  const { symbol } = getToken(token)

  return (
    <VaultDetailsSummaryContainer>
      <VaultDetailsSummaryItem
        label={t('system.vault-dai-debt')}
        value={
          <>
            {formatAmount(debt, 'DAI')}
            {` DAI`}
          </>
        }
        valueAfter={
          showAfterPill && (
            <>
              {formatAmount(afterDebt, 'DAI')}
              {` DAI`}
            </>
          )
        }
        afterPillColors={afterPillColors}
      />

      <VaultDetailsSummaryItem
        label={t('system.available-to-withdraw')}
        value={
          <>
            {formatAmount(freeCollateral, symbol)}
            {` ${symbol}`}
          </>
        }
        valueAfter={
          showAfterPill && (
            <>
              {formatAmount(afterFreeCollateral, symbol)}
              {` ${symbol}`}
            </>
          )
        }
        afterPillColors={afterPillColors}
      />
      <VaultDetailsSummaryItem
        label={t('system.available-to-generate')}
        value={
          <>
            {formatAmount(daiYieldFromLockedCollateral, 'DAI')}
            {` DAI`}
          </>
        }
        valueAfter={
          showAfterPill && (
            <>
              {formatAmount(daiYieldFromTotalCollateral, 'DAI')}
              {` DAI`}
            </>
          )
        }
        afterPillColors={afterPillColors}
      />
    </VaultDetailsSummaryContainer>
  )
}

export function ManageVaultDetails(
  props: ManageStandardBorrowVaultState & { onBannerButtonClickHandler: () => void },
) {
  const {
    vault: {
      daiYieldFromLockedCollateral,
      debt,
      freeCollateral,
      id,
      token,
      liquidationPrice,
      lockedCollateral,
      lockedCollateralUSD,
      collateralizationRatio,
    },
    ilkData: { liquidationRatio },
    liquidationPriceCurrentPriceDifference,
    afterLiquidationPrice,
    afterCollateralizationRatio,
    afterLockedCollateralUSD,
    collateralizationRatioAtNextPrice,
    afterDebt,
    afterFreeCollateral,
    daiYieldFromTotalCollateral,
    inputAmountsEmpty,
    stage,
    stopLossTriggered,
  } = props

  const { t } = useTranslation()
  const { uiChanges } = useAppContext()
  const afterCollRatioColor = getCollRatioColor(props, afterCollateralizationRatio)
  const afterPillColors = getAfterPillColors(afterCollRatioColor)
  const showAfterPill = !inputAmountsEmpty && stage !== 'manageSuccess'
  const changeVariant = showAfterPill ? getChangeVariant(afterCollRatioColor) : undefined
  const automationEnabled = useFeatureToggle('Automation')
  const automationBasicBuyAndSellEnabled = useFeatureToggle('AutomationBasicBuyAndSell')

  return (
    <Box>
      {automationEnabled && (
        <>
          {stopLossTriggered && <StopLossTriggeredBannerControl />}
          <GetProtectionBannerControl vaultId={id} />
          <StopLossBannerControl
            vaultId={id}
            liquidationPrice={liquidationPrice}
            liquidationRatio={liquidationRatio}
            afterLiquidationPrice={afterLiquidationPrice}
            showAfterPill={showAfterPill}
          />
        </>
      )}
      <DetailsSection
        title={t('system.overview')}
        buttons={[
          {
            label: t('system.actions.common.edit-position'),
            actions: [
              {
                label: t('system.actions.borrow.edit-dai'),
                action: () => {
                  alert('dai')
                },
              },
              {
                label: t('system.actions.borrow.edit-collateral'),
                action: () => {
                  alert('collateral')
                },
              },
              {
                label: t('system.actions.borrow.switch-to-multiply'),
                action: () => {
                  alert('switch-to-multiply')
                },
              },
            ],
          },
        ]}
        content={
          <DetailsSectionContentCardWrapper>
            <ContentCardLiquidationPrice
              liquidationPrice={liquidationPrice}
              liquidationRatio={liquidationRatio}
              liquidationPriceCurrentPriceDifference={liquidationPriceCurrentPriceDifference}
              afterLiquidationPrice={afterLiquidationPrice}
              changeVariant={changeVariant}
              vaultId={id}
            />
            <ContentCardCollateralizationRatio
              collateralizationRatio={collateralizationRatio}
              collateralizationRatioAtNextPrice={collateralizationRatioAtNextPrice}
              afterCollateralizationRatio={afterCollateralizationRatio}
              changeVariant={changeVariant}
            />
            <ContentCardCollateralLocked
              token={token}
              lockedCollateralUSD={lockedCollateralUSD}
              lockedCollateral={lockedCollateral}
              afterLockedCollateralUSD={afterLockedCollateralUSD}
              changeVariant={changeVariant}
            />
          </DetailsSectionContentCardWrapper>
        }
        footer={
          <DetailsSectionFooterItemWrapper>
            <BorrowFooterItems
              token={token}
              debt={debt}
              freeCollateral={freeCollateral}
              afterDebt={afterDebt}
              afterFreeCollateral={afterFreeCollateral}
              daiYieldFromLockedCollateral={daiYieldFromLockedCollateral}
              daiYieldFromTotalCollateral={daiYieldFromTotalCollateral}
              changeVariant={changeVariant}
            />
          </DetailsSectionFooterItemWrapper>
        }
      />
      <Grid variant="vaultDetailsCardsContainer">
        <VaultDetailsCardLiquidationPrice
          liquidationPrice={liquidationPrice}
          liquidationRatio={liquidationRatio}
          liquidationPriceCurrentPriceDifference={liquidationPriceCurrentPriceDifference}
          afterLiquidationPrice={afterLiquidationPrice}
          afterPillColors={afterPillColors}
          showAfterPill={showAfterPill}
          vaultId={id}
        />
        <VaultDetailsCardCollateralizationRatio
          afterPillColors={afterPillColors}
          showAfterPill={showAfterPill}
          {...props}
        />

        <VaultDetailsCardCurrentPrice {...props.priceInfo} />
        <VaultDetailsCardCollateralLocked
          depositAmountUSD={lockedCollateralUSD}
          afterDepositAmountUSD={afterLockedCollateralUSD}
          depositAmount={lockedCollateral}
          token={token}
          afterPillColors={afterPillColors}
          showAfterPill={showAfterPill}
        />
      </Grid>
      <ManageVaultDetailsSummary
        {...props}
        afterPillColors={afterPillColors}
        showAfterPill={showAfterPill}
      />
      {/* TODO: this is just an example, it should be removed or replaced with actual proper banner when basic buy would go live */}
      {automationBasicBuyAndSellEnabled && (
        <Box sx={{ mt: 3 }}>
          <SetupBanner
            header="Set up Stop Loss"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae erat at tellus blandit fermentum. Sed hendrerit hendrerit mi quis porttitor."
            button="Setup Stop Loss"
            backgroundImage="/static/img/setup-banner/stop-loss.svg"
            backgroundColor={setupBannerGradientPresets.stopLoss[0]}
            backgroundColorEnd={setupBannerGradientPresets.stopLoss[1]}
            handleClick={() => {
              uiChanges.publish(TAB_CHANGE_SUBJECT, {
                type: 'change-tab',
                currentMode: VaultViewMode.Protection,
              })
            }}
          />
        </Box>
      )}
    </Box>
  )
}
