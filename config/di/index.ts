import { STREAMS } from 'blockchain/constants/identifiers'
import { account$ } from 'blockchain/entities/account'
import { blocks$ } from 'blockchain/entities/blocks'
import { context } from 'blockchain/entities/context'
import { proxy } from 'blockchain/entities/proxy'
import { transactions } from 'blockchain/entities/transactions'
import { web3Context } from 'blockchain/entities/web3Context'
import { IAccount } from 'interfaces/blockchain/IAccount'
import { IBlocks } from 'interfaces/blockchain/IBlocks'
import { IContext } from 'interfaces/blockchain/IContext'
import { IProxy } from 'interfaces/blockchain/IProxy'
import { ITransactions } from 'interfaces/blockchain/ITransactions'
import { IWeb3Context } from 'interfaces/blockchain/IWeb3Context'
import { IOracle } from 'interfaces/protocols/IOracle'
import { Container } from 'inversify'
import { MAKER_STREAMS } from 'protocols/maker/constants/identifiers'
import { oracle } from 'protocols/maker/entities/oracle'

const blockchainContainer = (function (): { getInstance: () => Container } {
  let instance: Container

  function createInstance() {
    const container = new Container()
    container.bind<IWeb3Context>(STREAMS.WEB3_CONTEXT).toConstantValue(web3Context())
    container
      .bind<IBlocks>(STREAMS.BLOCKS)
      .toConstantValue(blocks$(container.get<IWeb3Context>(STREAMS.WEB3_CONTEXT)))
    container
      .bind<IContext>(STREAMS.CONTEXT)
      .toConstantValue(context(container.get<IWeb3Context>(STREAMS.WEB3_CONTEXT)))
    container
      .bind<IProxy>(STREAMS.PROXY)
      .toConstantValue(
        proxy(container.get<IContext>(STREAMS.CONTEXT), container.get<IBlocks>(STREAMS.BLOCKS)),
      )
    container
      .bind<IAccount>(STREAMS.ACCOUNT)
      .toConstantValue(
        account$(
          container.get<IWeb3Context>(STREAMS.WEB3_CONTEXT),
          container.get<IContext>(STREAMS.CONTEXT),
        ),
      )
    container
      .bind<ITransactions>(STREAMS.TRANSACTIONS)
      .toConstantValue(
        transactions(
          container.get<IContext>(STREAMS.CONTEXT),
          container.get<IAccount>(STREAMS.ACCOUNT),
          container.get<IBlocks>(STREAMS.BLOCKS),
        ),
      )

    return container
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance()
      }

      return instance
    },
  }
})()

const protocolContainer = (function (): { getInstance: () => Container } {
  let instance: Container
  function createInstance() {
    const container = new Container()

    container.parent = blockchainContainer.getInstance()
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
  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance()
      }

      return instance
    },
  }
})()

export const containers = {
  blockchain: blockchainContainer,
  protocol: protocolContainer,
}
