import { WithConnection } from 'components/connectWallet/ConnectWallet'
import { AppLayout } from 'components/Layouts'
import { ReferralLandingSummary } from 'features/referralOverview/ReferralLanding'
import { WithTermsOfService } from 'features/termsOfService/TermsOfService'
import { GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'
import { BackgroundLight } from 'theme/BackgroundLight'

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
    },
  }
}

export default function ReferralsPage() {
  return (
    <>
      <WithConnection>
        <WithTermsOfService>
          <BackgroundLight />
          <ReferralLandingSummary />
        </WithTermsOfService>
      </WithConnection>
    </>
  )
}

ReferralsPage.layout = AppLayout
