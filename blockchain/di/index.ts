import { bindDependencies } from 'helpers/di/bindDependencies'
import { IAccount } from 'interfaces/blockchain/IAccount'
import { IContext } from 'interfaces/blockchain/IContext'
import { IWeb3Context } from 'interfaces/blockchain/IWeb3Context'
import { Container, interfaces } from 'inversify'

import { STREAMS } from './constants/identifiers'
import { account } from './entities/account'
import { context } from './entities/context'
import { web3Context } from './entities/web3Context'

function blockchainContainerFactory() {
  const container = new Container()
  container.bind<IWeb3Context>(STREAMS.WEB3_CONTEXT).toConstantValue(web3Context())
  container
    .bind<interfaces.Factory<IContext>>(STREAMS.CONTEXT)
    .toFactory<IContext>(() => () =>
      bindDependencies<[IWeb3Context], IContext>(context, [STREAMS.WEB3_CONTEXT])(),
    )
  container
    .bind<interfaces.Factory<IAccount>>(STREAMS.ACCOUNT)
    .toFactory<IAccount>(() => () =>
      bindDependencies<[IWeb3Context], IAccount>(account, [STREAMS.CONTEXT])(),
    )

  return container
}

export { blockchainContainerFactory }
