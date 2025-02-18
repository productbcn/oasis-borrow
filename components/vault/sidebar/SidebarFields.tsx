import BigNumber from 'bignumber.js'
import { VaultAction, VaultActionInput } from 'components/vault/VaultActionInput'
import { ManageStandardBorrowVaultState } from 'features/borrow/manage/pipes/manageVault'
import { OpenVaultState } from 'features/borrow/open/pipes/openVault'
import { ManageMultiplyVaultState } from 'features/multiply/manage/pipes/manageMultiplyVault'
import { OpenMultiplyVaultState } from 'features/multiply/open/pipes/openMultiplyVault'
import { handleNumericInput } from 'helpers/input'
import { useTranslation } from 'next-i18next'
import { pick } from 'ramda'
import React from 'react'

type VaultState =
  | OpenVaultState
  | OpenMultiplyVaultState
  | ManageStandardBorrowVaultState
  | ManageMultiplyVaultState

interface FieldProps {
  action?: VaultAction
  disabled?: boolean
}

interface FieldDepositCollateralProps extends FieldProps {
  currentCollateralPrice: BigNumber
  depositAmount?: BigNumber
  depositAmountUSD?: BigNumber
  maxDepositAmount: BigNumber
  maxDepositAmountUSD: BigNumber
  token: string
  updateDeposit?: () => void
  updateDepositAmount?: () => void
  updateDepositAmountMax?: () => void
  updateDepositAmountUSD?: () => void
  updateDepositMax?: () => void
  updateDepositUSD?: () => void
}

interface FieldWithdrawCollateralProps extends FieldProps {
  currentCollateralPrice: BigNumber
  maxWithdrawAmount?: BigNumber
  maxWithdrawAmountUSD?: BigNumber
  token: string
  updateWithdraw?: () => void
  updateWithdrawAmount?: () => void
  updateWithdrawAmountUSD?: () => void
  updateWithdrawAmountMax?: () => void
  updateWithdrawMax?: () => void
  updateWithdrawUSD?: () => void
  withdrawAmount?: BigNumber
  withdrawAmountUSD?: BigNumber
}

interface FieldDepositDaiProps extends FieldProps {
  depositDaiAmount?: BigNumber
  maxDepositDaiAmount?: BigNumber
  updateDepositDai?: () => void
  updateDepositDaiAmount?: () => void
  updateDepositDaiAmountMax?: () => void
  updateDepositDaiMax?: () => void
}

interface FieldGenerateDaiProps extends FieldProps {
  debtFloor?: BigNumber
  generateAmount?: BigNumber
  maxGenerateAmount?: BigNumber
  updateGenerate?: (generateAmount?: BigNumber) => void
  updateGenerateAmount?: (generateAmount?: BigNumber) => void
  updateGenerateAmountMax?: () => void
  updateGenerateMax?: () => void
}

interface FieldPaybackDaiProps extends FieldProps {
  maxPaybackAmount?: BigNumber
  paybackAmount?: BigNumber
  updatePayback?: () => void
  updatePaybackAmount?: () => void
  updatePaybackAmountMax?: () => void
  updatePaybackMax?: () => void
}

export function extractFieldDepositCollateralData(state: VaultState) {
  return {
    ...pick(
      [
        'depositAmount',
        'depositAmountUSD',
        'maxDepositAmount',
        'maxDepositAmountUSD',
        'token',
        'updateDeposit',
        'updateDepositAmount',
        'updateDepositAmountMax',
        'updateDepositAmountUSD',
        'updateDepositMax',
        'updateDepositUSD',
      ],
      state,
    ),
    currentCollateralPrice: state.priceInfo.currentCollateralPrice,
  }
}

export function extractFieldWithdrawCollateralData(state: VaultState) {
  return {
    ...pick(
      [
        'maxWithdrawAmount',
        'maxWithdrawAmountUSD',
        'token',
        'updateWithdraw',
        'updateWithdrawAmount',
        'updateWithdrawAmountUSD',
        'updateWithdrawAmountMax',
        'updateWithdrawMax',
        'updateWithdrawUSD',
        'withdrawAmount',
        'withdrawAmountUSD',
      ],
      state,
    ),
    currentCollateralPrice: state.priceInfo.currentCollateralPrice,
  }
}

export function extractFieldDepositDaiData(state: VaultState) {
  return {
    ...pick(
      [
        'depositDaiAmount',
        'maxDepositDaiAmount',
        'updateDepositDai',
        'updateDepositDaiAmount',
        'updateDepositDaiAmountMax',
        'updateDepositDaiMax',
      ],
      state,
    ),
  }
}

export function extractFieldGenerateDaiData(state: VaultState) {
  return {
    ...pick(
      [
        'disabled',
        'generateAmount',
        'maxGenerateAmount',
        'updateGenerate',
        'updateGenerateAmount',
        'updateGenerateAmountMax',
        'updateGenerateMax',
      ],
      state,
    ),
    debtFloor: state.ilkData.debtFloor,
  }
}

export function extractFieldPaybackDaiData(state: VaultState) {
  return {
    ...pick(
      [
        'maxPaybackAmount',
        'paybackAmount',
        'updatePayback',
        'updatePaybackAmount',
        'updatePaybackAmountMax',
        'updatePaybackMax',
      ],
      state,
    ),
  }
}

export function FieldDepositCollateral({
  action = 'Deposit',
  currentCollateralPrice,
  depositAmount,
  depositAmountUSD,
  maxDepositAmount,
  maxDepositAmountUSD,
  token,
  updateDeposit,
  updateDepositAmount,
  updateDepositAmountMax,
  updateDepositAmountUSD,
  updateDepositMax,
  updateDepositUSD,
  disabled = false,
}: FieldDepositCollateralProps) {
  const { t } = useTranslation()

  return (
    <VaultActionInput
      action={action}
      amount={depositAmount}
      auxiliaryAmount={depositAmountUSD}
      hasAuxiliary={true}
      hasError={false}
      maxAmount={maxDepositAmount}
      maxAmountLabel={t('balance')}
      maxAuxiliaryAmount={maxDepositAmountUSD}
      onAuxiliaryChange={handleNumericInput(updateDepositUSD! || updateDepositAmountUSD!)}
      onChange={handleNumericInput(updateDeposit! || updateDepositAmount!)}
      onSetMax={updateDepositMax! || updateDepositAmountMax!}
      showMax={true}
      token={token}
      tokenUsdPrice={currentCollateralPrice}
      disabled={disabled}
    />
  )
}

export function FieldWithdrawCollateral({
  action = 'Withdraw',
  currentCollateralPrice,
  maxWithdrawAmount,
  maxWithdrawAmountUSD,
  token,
  updateWithdraw,
  updateWithdrawAmount,
  updateWithdrawAmountUSD,
  updateWithdrawAmountMax,
  updateWithdrawMax,
  updateWithdrawUSD,
  withdrawAmount,
  withdrawAmountUSD,
  disabled = false,
}: FieldWithdrawCollateralProps) {
  const { t } = useTranslation()

  return (
    <VaultActionInput
      action={action}
      amount={withdrawAmount}
      auxiliaryAmount={withdrawAmountUSD}
      disabled={disabled}
      hasAuxiliary={true}
      hasError={false}
      maxAmount={maxWithdrawAmount}
      maxAmountLabel={t('max')}
      maxAuxiliaryAmount={maxWithdrawAmountUSD}
      onAuxiliaryChange={handleNumericInput(updateWithdrawUSD! || updateWithdrawAmountUSD!)}
      onChange={handleNumericInput(updateWithdraw! || updateWithdrawAmount!)}
      onSetMax={updateWithdrawMax! || updateWithdrawAmountMax!}
      showMax={true}
      token={token}
      tokenUsdPrice={currentCollateralPrice}
    />
  )
}

export function FieldDepositDai({
  action = 'Deposit',
  depositDaiAmount,
  maxDepositDaiAmount,
  updateDepositDai,
  updateDepositDaiAmount,
  updateDepositDaiAmountMax,
  updateDepositDaiMax,
  disabled = false,
}: FieldDepositDaiProps) {
  const { t } = useTranslation()

  return (
    <VaultActionInput
      action={action}
      amount={depositDaiAmount}
      token="DAI"
      showMax={true}
      maxAmount={maxDepositDaiAmount}
      maxAmountLabel={t('max')}
      onSetMax={updateDepositDaiMax! || updateDepositDaiAmountMax!}
      onChange={handleNumericInput(updateDepositDai! || updateDepositDaiAmount!)}
      hasError={false}
      disabled={disabled}
    />
  )
}

export function FieldGenerateDai({
  action = 'Generate',
  debtFloor,
  generateAmount,
  maxGenerateAmount,
  updateGenerate,
  updateGenerateAmount,
  updateGenerateAmountMax,
  updateGenerateMax,
  disabled = false,
}: FieldGenerateDaiProps) {
  const { t } = useTranslation()

  return (
    <VaultActionInput
      action={action}
      amount={generateAmount}
      disabled={disabled}
      hasError={false}
      maxAmount={maxGenerateAmount}
      minAmount={debtFloor}
      minAmountLabel={t('from')}
      onChange={handleNumericInput(updateGenerate! || updateGenerateAmount!)}
      onSetMin={() => {
        if (updateGenerate) updateGenerate(debtFloor)
        if (updateGenerateAmount) updateGenerateAmount(debtFloor)
      }}
      onSetMax={updateGenerateMax! || updateGenerateAmountMax!}
      showMax={true}
      showMin={true}
      token={'DAI'}
    />
  )
}

export function FieldPaybackDai({
  action = 'Payback',
  maxPaybackAmount,
  paybackAmount,
  updatePayback,
  updatePaybackAmount,
  updatePaybackAmountMax,
  updatePaybackMax,
  disabled = false,
}: FieldPaybackDaiProps) {
  const { t } = useTranslation()

  return (
    <VaultActionInput
      action={action}
      amount={paybackAmount}
      disabled={disabled}
      hasError={false}
      maxAmount={maxPaybackAmount}
      maxAmountLabel={t('max')}
      onChange={handleNumericInput(updatePayback! || updatePaybackAmount!)}
      onSetMax={updatePaybackMax! || updatePaybackAmountMax!}
      showMax={true}
      token="DAI"
    />
  )
}
