import { TxHelpers, TxHelpers$ } from 'blockchain/entities/transactions'
import { TransactionManager } from 'features/account/transactionManager'
import { HasGasEstimation } from 'helpers/form'
import { Observable } from 'rxjs'

export interface ITransactions {
  getGasEstimate$: <S extends HasGasEstimation>(
    state: S,
    call: (send: TxHelpers, state: S) => Observable<number> | undefined,
  ) => Observable<S>
  getHelpers$: () => TxHelpers$
  getManager$: () => Observable<TransactionManager>
}
