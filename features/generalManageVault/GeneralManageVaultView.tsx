import { BigNumber } from 'bignumber.js'
import { ManageVaultContainer } from 'features/borrow/manage/containers/ManageVaultContainer'
import { SidebarManageMultiplyVault } from 'features/multiply/manage/sidebars/SidebarManageMultiplyVault'
import { Survey } from 'features/survey'
import { useFeatureToggle } from 'helpers/useFeatureToggle'
import React from 'react'
import { Container } from 'theme-ui'

import { useAppContext } from '../../components/AppContextProvider'
import { ManageMultiplyVaultContainer } from '../../components/vault/commonMultiply/ManageMultiplyVaultContainer'
import { DefaultVaultHeader } from '../../components/vault/DefaultVaultHeader'
import { VaultContainerSpinner, WithLoadingIndicator } from '../../helpers/AppSpinner'
import { WithErrorHandler } from '../../helpers/errorHandlers/WithErrorHandler'
import { useObservable } from '../../helpers/observableHook'
import { GuniVaultHeader } from '../earn/guni/common/GuniVaultHeader'
import { GuniManageMultiplyVaultDetails } from '../earn/guni/manage/containers/GuniManageMultiplyVaultDetails'
import { GuniManageMultiplyVaultForm } from '../earn/guni/manage/containers/GuniManageMultiplyVaultForm'
import { ManageInstiVaultContainer } from '../instiVault/manage/containers/ManageInstiVaultContainer'
import { ManageMultiplyVaultDetails } from '../multiply/manage/containers/ManageMultiplyVaultDetails'
import { ManageMultiplyVaultForm } from '../multiply/manage/containers/ManageMultiplyVaultForm'
import { VaultHistoryView } from '../vaultHistory/VaultHistoryView'
import { GeneralManageVaultState } from './generalManageVault'
import { VaultType } from './vaultType'

interface GeneralManageVaultViewProps {
  generalManageVault: GeneralManageVaultState
}

export function GeneralManageVaultViewAutomation({
  generalManageVault,
}: GeneralManageVaultViewProps) {
  const vaultType = generalManageVault.type
  const newComponentsEnabled = useFeatureToggle('NewComponents')

  switch (vaultType) {
    case VaultType.Borrow:
      return (
        <Container variant="vaultPageContainer" sx={{ zIndex: 0 }}>
          <ManageVaultContainer manageVault={generalManageVault.state} />
          <Survey for="borrow" />
        </Container>
      )
    case VaultType.Insti:
      return (
        <Container variant="vaultPageContainer" sx={{ zIndex: 0 }}>
          <ManageInstiVaultContainer manageVault={generalManageVault.state} />
        </Container>
      )
    case VaultType.Multiply:
      const vaultIlk = generalManageVault.state.ilkData.ilk
      return (
        <Container variant="vaultPageContainer" sx={{ zIndex: 0 }}>
          {['GUNIV3DAIUSDC1-A', 'GUNIV3DAIUSDC2-A'].includes(vaultIlk) ? (
            <ManageMultiplyVaultContainer
              manageVault={generalManageVault.state}
              details={GuniManageMultiplyVaultDetails}
              header={GuniVaultHeader}
              form={GuniManageMultiplyVaultForm}
              history={VaultHistoryView}
            />
          ) : (
            <ManageMultiplyVaultContainer
              manageVault={generalManageVault.state}
              header={DefaultVaultHeader}
              details={ManageMultiplyVaultDetails}
              form={!newComponentsEnabled ? ManageMultiplyVaultForm : SidebarManageMultiplyVault}
              history={VaultHistoryView}
            />
          )}
          <Survey for="multiply" />
        </Container>
      )
    default:
      throw new Error(
        `could not render GeneralManageVaultViewAutomation for vault type ${vaultType}`,
      )
  }
}

export function GeneralManageVaultView({ id }: { id: BigNumber }) {
  const { generalManageVault$ } = useAppContext()
  const manageVaultWithId$ = generalManageVault$(id)
  const [manageVault, manageVaultError] = useObservable(manageVaultWithId$)
  const newComponentsEnabled = useFeatureToggle('NewComponents')

  return (
    <WithErrorHandler error={[manageVaultError]}>
      <WithLoadingIndicator value={[manageVault]} customLoader={<VaultContainerSpinner />}>
        {([generalManageVault]) => {
          switch (generalManageVault.type) {
            case VaultType.Borrow:
              return (
                <Container variant="vaultPageContainer">
                  <ManageVaultContainer manageVault={generalManageVault.state} />
                  <Survey for="borrow" />
                </Container>
              )
            case VaultType.Insti:
              return (
                <Container variant="vaultPageContainer">
                  <ManageInstiVaultContainer manageVault={generalManageVault.state} />
                </Container>
              )
            case VaultType.Multiply:
              const vaultIlk = generalManageVault.state.ilkData.ilk

              return (
                <Container variant="vaultPageContainer">
                  {['GUNIV3DAIUSDC1-A', 'GUNIV3DAIUSDC2-A'].includes(vaultIlk) ? (
                    <ManageMultiplyVaultContainer
                      manageVault={generalManageVault.state}
                      details={GuniManageMultiplyVaultDetails}
                      header={GuniVaultHeader}
                      form={GuniManageMultiplyVaultForm}
                      history={VaultHistoryView}
                    />
                  ) : (
                    <ManageMultiplyVaultContainer
                      manageVault={generalManageVault.state}
                      header={DefaultVaultHeader}
                      details={ManageMultiplyVaultDetails}
                      form={
                        !newComponentsEnabled ? ManageMultiplyVaultForm : SidebarManageMultiplyVault
                      }
                      history={VaultHistoryView}
                    />
                  )}
                  <Survey for="multiply" />
                </Container>
              )
          }
        }}
      </WithLoadingIndicator>
    </WithErrorHandler>
  )
}
