import BigNumber from 'bignumber.js'
import { getToken } from 'blockchain/tokensMetadata'
import {
  ChangeVariantType,
  ContentCardProps,
  DetailsSectionContentCard,
} from 'components/DetailsSectionContentCard'
import { formatAmount } from 'helpers/formatters/format'
import { zero } from 'helpers/zero'
import { useTranslation } from 'next-i18next'
import { Card, Grid, Heading, Text } from 'theme-ui'

interface ContentCardCollateralLockedModalProps {
  lockedCollateralUSDFormatted: string
  lockedCollateralFormatted: string
}
interface ContentCardCollateralLockedProps {
  token: string
  lockedCollateralUSD?: BigNumber
  lockedCollateral?: BigNumber
  afterLockedCollateralUSD?: BigNumber
  changeVariant?: ChangeVariantType
}

function ContentCardLiquidationPriceModal({
  lockedCollateralUSDFormatted,
  lockedCollateralFormatted,
}: ContentCardCollateralLockedModalProps) {
  const { t } = useTranslation()

  return (
    <Grid gap={2}>
      <Heading variant="header3">{t('system.collateral-locked')}</Heading>
      <Heading variant="header3">{t('manage-vault.card.collateral-locked-amount')}</Heading>
      <Card as="p" variant="vaultDetailsCardModal" sx={{ my: 2 }}>
        {lockedCollateralFormatted}
      </Card>
      <Heading variant="header3">{t('manage-vault.card.collateral-locked-USD')}</Heading>
      <Card as="p" variant="vaultDetailsCardModal" sx={{ my: 2 }}>
        {lockedCollateralUSDFormatted}
      </Card>
      <Text as="p" variant="subheader" sx={{ fontSize: 2 }}>
        {t('manage-vault.card.collateral-locked-oracles')}
      </Text>
    </Grid>
  )
}

export function ContentCardCollateralLocked({
  token,
  lockedCollateralUSD,
  lockedCollateral,
  afterLockedCollateralUSD,
  changeVariant,
}: ContentCardCollateralLockedProps) {
  const { t } = useTranslation()
  const { symbol } = getToken(token)

  const formatted = {
    lockedCollateralUSD: `$${formatAmount(lockedCollateralUSD || zero, 'USD')}`,
    lockedCollateral: `${formatAmount(lockedCollateral || zero, symbol)} ${symbol}`,
    afterLockedCollateralUSD: `$${formatAmount(afterLockedCollateralUSD || zero, 'USD')}`,
  }

  const contentCardModalSettings: ContentCardCollateralLockedModalProps = {
    lockedCollateralUSDFormatted: formatted.lockedCollateralUSD,
    lockedCollateralFormatted: formatted.lockedCollateral,
  }

  const contentCardSettings: ContentCardProps = {
    title: t('system.collateral-locked'),
    value: formatted.lockedCollateralUSD,
    footnote: formatted.lockedCollateral,
    modal: <ContentCardLiquidationPriceModal {...contentCardModalSettings} />,
  }

  if (afterLockedCollateralUSD && changeVariant)
    contentCardSettings.change = {
      value: formatted.afterLockedCollateralUSD,
      variant: changeVariant,
    }

  return <DetailsSectionContentCard {...contentCardSettings} />
}
