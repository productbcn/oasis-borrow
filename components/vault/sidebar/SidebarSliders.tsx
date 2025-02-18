import { getCollRatioColor } from 'components/vault/VaultDetails'
import { ManageMultiplyVaultState } from 'features/multiply/manage/pipes/manageMultiplyVault'
import { OpenMultiplyVaultState } from 'features/multiply/open/pipes/openMultiplyVault'
import { formatAmount, formatPercent } from 'helpers/formatters/format'
import { zero } from 'helpers/zero'
import { useTranslation } from 'next-i18next'
import React, { ChangeEvent } from 'react'
import { Box, Flex, Grid, Slider, Text, useThemeUI } from 'theme-ui'

type VaultState = OpenMultiplyVaultState | ManageMultiplyVaultState

interface SidebarSliderAdjustMultiplyProps {
  collapsed?: boolean
  disabled?: boolean
  max?: number
  min?: number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  state: VaultState
  value: number
}

export function SidebarSliderAdjustMultiply({
  collapsed = false,
  disabled = false,
  max,
  min,
  onChange,
  state,
  value,
}: SidebarSliderAdjustMultiplyProps) {
  const { t } = useTranslation()

  const {
    afterLiquidationPrice,
    afterCollateralizationRatio,
    multiply,
    maxCollRatio,
    requiredCollRatio,
    ilkData: { liquidationRatio },
  } = state

  const {
    theme: { colors },
  } = useThemeUI()

  const slider = requiredCollRatio
    ? maxCollRatio?.minus(requiredCollRatio)?.div(maxCollRatio.minus(liquidationRatio)).times(100)
    : zero
  const collRatioColor = getCollRatioColor(state, afterCollateralizationRatio)
  const sliderBackground =
    multiply && !multiply.isNaN() && slider
      ? `linear-gradient(to right, ${colors?.sliderTrackFill} 0%, ${
          colors?.sliderTrackFill
        } ${slider.toNumber()}%, ${colors?.primaryAlt} ${slider.toNumber()}%, ${
          colors?.primaryAlt
        } 100%)`
      : 'primaryAlt'

  return (
    <Grid
      gap={2}
      sx={
        collapsed
          ? {
              px: 3,
              py: 2,
              border: 'lightMuted',
              borderTop: 'none',
              borderBottomLeftRadius: 'mediumLarge',
              borderBottomRightRadius: 'mediumLarge',
            }
          : {}
      }
    >
      <Flex
        sx={{
          variant: 'text.paragraph4',
          justifyContent: 'space-between',
          fontWeight: 'semiBold',
          color: 'text.subtitle',
        }}
      >
        <Grid as="p" gap={2}>
          <Text as="span">{t('system.liquidation-price')}</Text>
          <Text as="span" variant="paragraph1" sx={{ fontWeight: 'semiBold' }}>
            ${formatAmount(afterLiquidationPrice, 'USD')}
          </Text>
        </Grid>
        <Grid as="p" gap={2}>
          <Text as="span">{t('system.collateral-ratio')}</Text>
          <Text
            as="span"
            variant="paragraph1"
            sx={{ fontWeight: 'semiBold', textAlign: 'right', color: collRatioColor }}
          >
            {formatPercent(afterCollateralizationRatio.times(100))}
          </Text>
        </Grid>
      </Flex>
      <Box my={1}>
        <Slider
          sx={{
            background: sliderBackground,
            direction: 'rtl',
          }}
          disabled={disabled}
          step={0.05}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
        />
      </Box>
      <Flex
        sx={{
          variant: 'text.paragraph4',
          justifyContent: 'space-between',
          color: 'text.subtitle',
        }}
      >
        <Text as="span">{t('slider.adjust-multiply.left-footer')}</Text>
        <Text as="span">{t('slider.adjust-multiply.right-footer')}</Text>
      </Flex>
    </Grid>
  )
}
