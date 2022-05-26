import { STREAMS } from 'blockchain/constants/identifiers'
import { account } from 'blockchain/entities/account'
import { blocks } from 'blockchain/entities/blocks'
import { context } from 'blockchain/entities/context'
import { web3Context } from 'blockchain/entities/web3Context'
import { IAccount } from 'interfaces/blockchain/IAccount'
import { IBlocks } from 'interfaces/blockchain/IBlocks'
import { IContext } from 'interfaces/blockchain/IContext'
import { IWeb3Context } from 'interfaces/blockchain/IWeb3Context'
import { IOracle } from 'interfaces/protocols/IOracle'
import { Container } from 'inversify'
import { MAKER_STREAMS } from 'protocols/maker/constants/identifiers'
import { oracle } from 'protocols/maker/entities/oracle'

function createBlockchainContainer(): Container {
  const container = new Container()
  container.bind<IWeb3Context>(STREAMS.WEB3_CONTEXT).toConstantValue(web3Context())
  container
    .bind<IBlocks>(STREAMS.BLOCKS)
    .toConstantValue(blocks(container.get<IWeb3Context>(STREAMS.WEB3_CONTEXT)))
  container
    .bind<IContext>(STREAMS.CONTEXT)
    .toConstantValue(context(container.get<IWeb3Context>(STREAMS.WEB3_CONTEXT)))
  container
    .bind<IAccount>(STREAMS.ACCOUNT)
    .toConstantValue(
      account(
        container.get<IWeb3Context>(STREAMS.WEB3_CONTEXT),
        container.get<IContext>(STREAMS.CONTEXT),
      ),
    )

  return container
}

export const blockchainContainer = createBlockchainContainer()

function createProtocolContainer(): Container {
  const container = new Container()

  container.parent = blockchainContainer
  container
    .bind<IOracle>(MAKER_STREAMS.ORACLE)
    .toConstantValue(
      oracle(
        container.parent.get<IContext>(STREAMS.CONTEXT),
        container.parent.get<IBlocks>(STREAMS.BLOCKS),
      ),
    )

  return container
}

export const protocolContainer = createProtocolContainer()
