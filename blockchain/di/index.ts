import { Web3Context } from '@oasisdex/web3-context'
import { IContext } from 'interfaces/IContext'
import { Container } from 'inversify'
import { Observable } from 'rxjs'

import { STREAMS } from './constants/identifiers'
import { web3Context$ } from './entities/web3Context'

function rootContainerFactory() {
  const container = new Container()
  container
    .bind<IContext<Observable<Web3Context>>>(STREAMS.WEB3_CONTEXT)
    .toConstantValue(web3Context$())

  return container
}

export { rootContainerFactory }
