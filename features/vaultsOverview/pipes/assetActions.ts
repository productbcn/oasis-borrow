import { map as mapL, reduce } from 'lodash'
import { combineLatest, iif, Observable, of } from 'rxjs'
import { flatMap, map, startWith } from 'rxjs/operators'

import { ContextConnected } from '../../../blockchain/network'
import { UIChanges } from '../../../components/AppContext'
import { getProductCategoryUrl, ProductCategory } from '../../../config/product-categories'
import { mapTokenToFilter, supportedEarnIlks } from '../../../helpers/productCards'
import { useFeatureToggle } from '../../../helpers/useFeatureToggle'
import {
  SWAP_WIDGET_CHANGE_SUBJECT,
  SwapWidgetChangeAction,
} from '../../automation/protection/common/UITypes/SwapWidgetChange'

export type AssetAction = UrlAssetAction | OnClickAssetAction

type UrlAssetAction = {
  path: string
  hash?: string
  text: string
  icon: string
}

type OnClickAssetAction = {
  onClick: () => void
  text: string
  icon: string
}

export function isUrlAction(aa: AssetAction): aa is UrlAssetAction {
  return (aa as UrlAssetAction).path !== undefined
}

export function isOnClickAction(aa: AssetAction): aa is OnClickAssetAction {
  return (aa as OnClickAssetAction).onClick !== undefined
}

type ProductCategoryIlks = {
  [category in ProductCategory]: Array<string> // Array<ilks>
}

function productCategoryToAssetAction(
  productCategory: ProductCategory,
  token: string,
): AssetAction {
  const filter = mapTokenToFilter(token)

  const urlFragment = filter ? `#${filter.urlFragment}` : ''

  switch (productCategory) {
    case 'borrow':
      return {
        path: getProductCategoryUrl('borrow'),
        hash: urlFragment,
        text: 'Borrow',
        icon: 'collateral',
      }
    case 'multiply':
      return {
        path: getProductCategoryUrl('multiply'),
        hash: urlFragment,
        text: 'Multiply',
        icon: 'copy',
      }
    case 'earn':
      return {
        path: getProductCategoryUrl('earn'),
        hash: urlFragment,
        text: 'Earn',
        icon: 'increase',
      }
    default:
      throw new Error(`no asset action for productCategory ${productCategory}`)
  }
}

// returns a list of actions a user can perform for a given asset
export function createAssetActions$(
  context$: Observable<ContextConnected>,
  ilkToToken$: (ilk: string) => Observable<string>,
  productCategoryIlks: ProductCategoryIlks,
  uiChanges: UIChanges,
  token: string,
): Observable<Array<AssetAction>> {
  const contextConnected$ = context$.pipe(startWith(undefined))
  const ilkToProductCategory = reduce<
    ProductCategoryIlks,
    {
      [ilk: string]: Array<ProductCategory>
    }
  >(
    productCategoryIlks,
    (acc, ilksInProduct, productCategory) => {
      ilksInProduct.forEach((ilk) => {
        if (!acc[ilk]) {
          acc[ilk] = [productCategory as ProductCategory] // Object entries/reduce etc map to `string` for keys
        } else {
          acc[ilk].push(productCategory as ProductCategory) // Object entries/reduce etc map to `string` for keys
        }
      })
      return acc
    },
    {},
  )

  const earnProductEnabled = useFeatureToggle('EarnProduct')

  const assetActions$ = combineLatest(
    mapL(ilkToProductCategory, (productCategories, ilk) => {
      return combineLatest(
        iif(() => supportedEarnIlks.includes(ilk), of('DAI'), ilkToToken$(ilk)),
        of(productCategories),
      )
    }),
  ).pipe(
    map((tokenToProductCategories) => {
      const relevantMappings = tokenToProductCategories.filter(([t]) => t === token)
      return relevantMappings
        .reduce<Array<ProductCategory>>((acc, [_token, productCategories]) => {
          return [...new Set([...acc, ...productCategories])] // dedupe
        }, [])
        .map((productCategory) => productCategoryToAssetAction(productCategory, token))
    }),

    map((assetActions) => {
      if (earnProductEnabled && token === 'DAI') {
        return assetActions.filter((assetAction) => {
          return assetAction.text !== 'Multiply'
        })
      } else {
        return assetActions
      }
    }),
    // add swap
    flatMap((assetActions) => combineLatest(of(assetActions), contextConnected$)),
    map(([assetActions, contextIsConnected]) => {
      const swapAction = contextIsConnected
        ? [
            {
              onClick: () => {
                uiChanges.publish<SwapWidgetChangeAction>(SWAP_WIDGET_CHANGE_SUBJECT, {
                  type: 'open',
                  token,
                })
              },
              text: 'Swap',
              icon: 'exchange',
            },
          ]
        : []
      return [...swapAction, ...assetActions]
    }),
  )

  return assetActions$
}
