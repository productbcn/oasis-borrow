import BigNumber from 'bignumber.js'
import {
  extractFieldDepositCollateralData,
  FieldDepositCollateral,
} from 'components/vault/sidebar/SidebarFields'
import { SidebarResetButton } from 'components/vault/sidebar/SidebarResetButton'
import { SidebarSliderAdjustMultiply } from 'components/vault/sidebar/SidebarSliders'
import { OpenMultiplyVaultChangesInformation } from 'features/multiply/open/containers/OpenMultiplyVaultChangesInformation'
import { OpenMultiplyVaultState } from 'features/multiply/open/pipes/openMultiplyVault'
import React from 'react'
import { Grid } from 'theme-ui'

export function SidebarOpenMultiplyVaultEditingState(props: OpenMultiplyVaultState) {
  const {
    canAdjustRisk,
    clear,
    ilkData: { liquidationRatio },
    inputAmountsEmpty,
    maxCollRatio,
    requiredCollRatio,
    token,
    updateRequiredCollRatio,
  } = props

  return (
    <Grid gap={3}>
      <FieldDepositCollateral token={token} {...extractFieldDepositCollateralData(props)} />
      <SidebarSliderAdjustMultiply
        state={props}
        min={liquidationRatio.toNumber()}
        max={maxCollRatio?.toNumber()}
        value={canAdjustRisk && requiredCollRatio ? requiredCollRatio.toNumber() : 100}
        onChange={(e) => {
          updateRequiredCollRatio && updateRequiredCollRatio(new BigNumber(e.target.value))
        }}
      />
      {!inputAmountsEmpty && <SidebarResetButton clear={clear} />}
      <OpenMultiplyVaultChangesInformation {...props} />
    </Grid>
  )
}
