import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import SEO from '@components/common/SEO'
import { useTranslation } from 'next-i18next'

/**
 * Index: The Landing page of the Self Onboarding
 * @return {JSX.Element} The JSX Code for the Index
 */

export default function Index(): JSX.Element {
  const { t } = useTranslation()
  return (
    <>
      <SEO />
      <div
        className="flex flex-col w-full h-full min-h-screen bg-contain bg-no-repeat lg:bg-cover relative box-border bg-slate-50"
        style={{ backgroundImage: `url(/img/bg_self.png)` }}
      >
        <div className="w-full box-border p-2 lg:p-20 absolute top-40 lg:top-0">
          <div className="flex flex-col gap-4 p-4 justify-center items-center bg-white rounded-md shadow-md lg:w-[40%]">
            <img src="/img/logo_white@2x.png" alt="Logo Image" width={130} height={35} loading="lazy" />
            <h1 className=" text-xl font-semibold text-gray-700 capitalize text-center">{t('self:title')}</h1>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['self'])),
    },
  }
}
