import { Icon } from '@makerdao/dai-ui-icons'
import { StatefulTooltip } from 'components/Tooltip'
import { WithChildren } from 'helpers/types'
import _ from 'lodash'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { Box, Button, Flex, Grid, SxStyleProp, Text } from 'theme-ui'

import { AppLink, AppLinkProps } from '../Links'

function DumbHeader({ label, tooltip }: { label: string; tooltip?: JSX.Element | string }) {
  return (
    <Flex sx={{ alignItems: 'center' }}>
      <Text sx={{ fontSize: 1, color: 'text.subtitle', fontWeight: 'medium' }}>{label}</Text>
      {tooltip && (
        <StatefulTooltip
          tooltip={
            <Text sx={{ fontWeight: 'semiBold', mb: 1, fontSize: 2, textAlign: 'left' }}>
              {tooltip}
            </Text>
          }
        >
          <Icon name="question_o" size="16px" sx={{ ml: 1, flexShrink: 0 }} color="text.subtitle" />
        </StatefulTooltip>
      )}
    </Flex>
  )
}

function Header({ name }: { name: string }) {
  const { t } = useTranslation()
  return (
    <DumbHeader
      label={t(`earn.position-headers.${name}.label`)}
      tooltip={t(`earn.position-headers.${name}.tooltip`)}
    />
  )
}

function Cell({ children }: WithChildren) {
  return (
    <Box sx={{ py: 2, color: 'primary' }}>
      <Text sx={{ my: 1 }}>{children}</Text>
    </Box>
  )
}

type PositionCommonProps = {
  icon: string
  ilk: string
  vaultID: string
  editLinkProps: AppLinkProps
}

export type BorrowPositionVM = {
  type: 'borrow'
  collateralRatio: string
  inDanger: boolean
  daiDebt: string
  collateralLocked: string
  variable: string
  automationEnabled: boolean
  protectionAmount?: string
  automationLinkProps: AppLinkProps
} & PositionCommonProps

export type MultiplyPositionVM = {
  type: 'multiply'
  netValue: string
  multiple: string
  liquidationPrice: string
  fundingCost: string
  automationEnabled: boolean
  automationLinkProps: AppLinkProps
} & PositionCommonProps

export type EarnPositionVM = {
  type: 'earn'
  netValue: string
  pnl: string
  sevenDayYield: string
  liquidity: string
} & PositionCommonProps

export type PositionVM = BorrowPositionVM | MultiplyPositionVM | EarnPositionVM

interface InfoItem {
  header: JSX.Element
  info: JSX.Element | string
}

function AutomationButton({ position }: { position: BorrowPositionVM | MultiplyPositionVM }) {
  const { t } = useTranslation()

  const { automationLinkProps } = position

  return position.automationEnabled ? (
    <AppLink {...automationLinkProps}>
      <Button variant="actionActiveGreen">
        {t('earn.automation-button-on')} {position.type === 'borrow' && position.protectionAmount}
      </Button>
    </AppLink>
  ) : (
    <AppLink {...automationLinkProps}>
      <Button variant="action">{t('earn.automation-button-off')}</Button>
    </AppLink>
  )
}

function getPositionInfoItems(position: PositionVM): InfoItem[] {
  const assetInfo = {
    header: <Header name="asset" />,
    info: (
      <Flex
        sx={{
          alignItems: 'center',
          wordBreak: ['break-word', null],
          whiteSpace: [null, 'nowrap'],
        }}
      >
        <Icon name={position.icon} size={[26, 42]} sx={{ mr: 2, flexShrink: 0 }} />{' '}
        <Text>{position.ilk}</Text>
      </Flex>
    ),
  }

  const vaultIdInfo = {
    header: <Header name="vault-id" />,
    info: position.vaultID,
  }

  switch (position.type) {
    case 'borrow':
      return [
        assetInfo,
        vaultIdInfo,
        {
          header: <Header name="collateral-ratio" />,
          info: (
            <Text sx={{ color: position.inDanger ? '#D94A1E' : 'onSuccess' }}>
              {position.collateralRatio}
            </Text>
          ),
        },
        {
          header: <Header name="dai-debt" />,
          info: position.daiDebt,
        },
        {
          header: <Header name="collateral-locked" />,
          info: position.collateralLocked,
        },
        {
          header: <Header name="variable-perc" />,
          info: position.variable,
        },
        {
          header: <Header name="automation" />,
          info: <AutomationButton position={position} />,
        },
      ]
    case 'multiply':
      return [
        assetInfo,
        vaultIdInfo,
        {
          header: <Header name="net-value" />,
          info: position.netValue,
        },
        {
          header: <Header name="multiple" />,
          info: position.multiple,
        },
        {
          header: <Header name="liquidation-price" />,
          info: position.liquidationPrice,
        },
        {
          header: <Header name="funding-cost" />,
          info: position.fundingCost,
        },
        {
          header: <Header name="automation" />,
          info: <AutomationButton position={position} />,
        },
      ]
    case 'earn':
      return [
        assetInfo,
        vaultIdInfo,
        {
          header: <Header name="net-value" />,
          info: position.netValue,
        },
        {
          header: <Header name="pnl" />,
          info: position.pnl,
        },
        {
          header: <Header name="seven-day-yield" />,
          info: position.sevenDayYield,
        },
        {
          header: <Header name="liquidity" />,
          info: position.liquidity,
        },
      ]
  }
}

function Separator({ sx }: { sx?: SxStyleProp }) {
  return (
    <Box
      sx={{ borderTop: '1px solid', borderColor: 'border', height: '1px', width: '100%', ...sx }}
    />
  )
}

function ProductHeading({ title, count }: { title: string; count: number }) {
  return (
    <Text variant="paragraph3" sx={{ fontWeight: 'medium', my: 2 }}>
      {title} ({count})
    </Text>
  )
}

export function PositionList({ positions }: { positions: PositionVM[] }) {
  const { t } = useTranslation()

  const columnCount = 8
  const positionsByType = _.groupBy(positions, 'type')
  const fillRowSx = { gridColumn: `1 / span ${columnCount}` }

  function pad(items: any[], count: number) {
    return items.concat(
      new Array(count - items.length).fill(0).map((_, index) => {
        return <div key={index} />
      }),
    )
  }

  return (
    <Box sx={{ color: 'primary', zIndex: 1 }}>
      <Text variant="paragraph2" sx={{ fontWeight: 'medium', my: 3 }}>
        {t('earn.your-positions')} ({positions.length})
      </Text>

      {/* DESKTOP */}
      <Box sx={{ display: ['none', 'block'], overflowX: 'scroll' }}>
        <Grid
          sx={{
            gridTemplateColumns: `repeat(${columnCount}, auto)`,
            columnGap: 4,
            rowGap: 3,
            alignItems: 'center',
            minWidth: '1136px',
            button: { width: '100%' },
          }}
        >
          {Object.entries(positionsByType).map(([type, positions], index, array) => {
            const headers = pad(
              getPositionInfoItems(positions[0]).map((infoItem, index) => (
                <React.Fragment key={`h-${index}`}>{infoItem.header}</React.Fragment>
              )),
              columnCount,
            )
            return (
              <React.Fragment key={`line-${index}-${type}`}>
                <Box sx={fillRowSx} key={`box-${index}-${type}`}>
                  <ProductHeading
                    title={t(`product-page.${type}.title`)}
                    count={positions.length}
                  />
                </Box>
                {headers}
                {positions.map((position, index) => (
                  <React.Fragment key={`value-fragment-${index}-${position.ilk}`}>
                    {pad(
                      getPositionInfoItems(position).map((infoItem, i) => (
                        <Cell key={`${index}-${i}`}>{infoItem.info}</Cell>
                      )),
                      columnCount - 1,
                    )}
                    <AppLink {...position.editLinkProps}>
                      <Button variant="secondary" sx={{ fontSize: 1 }}>
                        {t('earn.edit-vault')}
                      </Button>
                    </AppLink>
                  </React.Fragment>
                ))}
                {index < array.length - 1 && <Separator sx={{ mb: 2, ...fillRowSx }} />}
              </React.Fragment>
            )
          })}
        </Grid>
      </Box>

      {/* MOBILE */}
      <Box sx={{ display: ['block', 'none'] }}>
        {Object.entries(positionsByType).map(([type, positions], index, array) => {
          return (
            <Box sx={{ pt: 1 }} key={`${index}-${type}`}>
              <ProductHeading title={t(`product-page.${type}.title`)} count={positions.length} />
              {positions.map((position, index) => (
                <Grid
                  sx={{ gap: 4, mb: 4, pt: 3, pb: 2 }}
                  key={`grid-${index}-${position.ilk}-${position.type}`}
                >
                  <Grid sx={{ gridTemplateColumns: '1fr 1fr', justifyItems: 'start', gap: 4 }}>
                    {getPositionInfoItems(position).map(({ header, info }, index) => (
                      <Grid sx={{ gap: 2 }} key={`inner-grip-${index}`}>
                        {header}
                        {info}
                      </Grid>
                    ))}
                  </Grid>
                  <AppLink {...position.editLinkProps}>
                    <Button variant="secondary" sx={{ fontSize: 1 }}>
                      {t('earn.edit-vault')}
                    </Button>
                  </AppLink>
                </Grid>
              ))}
              {index < array.length - 1 && <Separator sx={{ my: 4 }} />}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
