import { useTranslation } from 'next-i18next'
import React from 'react'
import { Flex, Grid } from 'theme-ui'

import { useAppContext } from '../../components/AppContextProvider'
import { ProductCardBorrow } from '../../components/ProductCardBorrow'
import { ProductCardsFilter } from '../../components/ProductCardsFilter'
import { ProductCardsWrapper } from '../../components/ProductCardsWrapper'
import { ProductHeader } from '../../components/ProductHeader'
import { AppSpinner, WithLoadingIndicator } from '../../helpers/AppSpinner'
import { WithErrorHandler } from '../../helpers/errorHandlers/WithErrorHandler'
import { useObservable } from '../../helpers/observableHook'
import {
  borrowPageCardsData,
  productCardsConfig,
  ProductLandingPagesFiltersKeys,
} from '../../helpers/productCards'

export function BorrowView() {
  const { t } = useTranslation()
  const { productCardsData$ } = useAppContext()
  const [productCardsData, productCardsDataError] = useObservable(productCardsData$)
  const tab = window.location.hash.replace(/^#/, '')

  return (
    <Grid
      sx={{
        flex: 1,
        position: 'relative',
        mb: ['123px', '187px'],
      }}
    >
      <ProductHeader
        title={t('product-page.borrow.title')}
        description={t('product-page.borrow.description')}
        link={{
          href: 'https://kb.oasis.app/help/what-is-oasis-borrow ',
          text: t('product-page.borrow.link'),
        }}
        scrollToId={tab}
      />

      <WithErrorHandler error={[productCardsDataError]}>
        <WithLoadingIndicator
          value={[productCardsData]}
          customLoader={
            <Flex sx={{ alignItems: 'flex-start', justifyContent: 'center', height: '500px' }}>
              <AppSpinner sx={{ mt: 5 }} variant="styles.spinner.large" />
            </Flex>
          }
        >
          {([productCardsData]) => (
            <ProductCardsFilter
              filters={productCardsConfig.borrow.cardsFilters}
              selectedFilter={tab}
            >
              {(cardsFilter: ProductLandingPagesFiltersKeys) => {
                const filteredCards = borrowPageCardsData({ productCardsData, cardsFilter })

                return (
                  <ProductCardsWrapper>
                    {filteredCards.map((cardData) => (
                      <ProductCardBorrow cardData={cardData} key={cardData.ilk} />
                    ))}
                  </ProductCardsWrapper>
                )
              }}
            </ProductCardsFilter>
          )}
        </WithLoadingIndicator>
      </WithErrorHandler>
    </Grid>
  )
}
