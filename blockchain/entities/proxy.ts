import { createProxyAddress$, createProxyOwner$ } from 'blockchain/calls/proxy'
import { IBlocks } from 'interfaces/blockchain/IBlocks'
import { IContext } from 'interfaces/blockchain/IContext'
import { IProxy } from 'interfaces/blockchain/IProxy'
import { memoize } from 'lodash'

import curry from 'ramda/src/curry'

export function proxy(context: IContext, blocks: IBlocks): IProxy {
  const context$ = context.get$()
  const onEveryBlock$ = blocks.get$()
  const proxyAddress$ = memoize(curry(createProxyAddress$)(onEveryBlock$, context$))
  const proxyOwner$ = memoize(curry(createProxyOwner$)(onEveryBlock$, context$))

  return {
    getProxy$: (account: string) => proxyAddress$(account),
    getProxyOwner$: (proxyAddress: string) => proxyOwner$(proxyAddress),
  }
}
