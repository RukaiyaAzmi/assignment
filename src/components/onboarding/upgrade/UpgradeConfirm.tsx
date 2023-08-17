import React, { useEffect, useState } from 'react'
import { useAPIWithToken } from '@hooks/useAPI'
import { postFullProfile, postUpgradeToRegular } from '@config/urls.config'
import { toast } from 'react-toastify'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'
import { IProfileDataRes, IProfileData } from '@interfaces/full-profile.interface'
import { FaCheck, FaTimes } from 'react-icons/fa'
import router from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import PrevButton from '@components/common/PrevButton'
import Button from '@components/common/Button'
import { IUpgradeRes } from '@interfaces/onboarding.interface'
import { decrement } from '@redux/slices/upgrade.slice'

export default function UpgradeConfirm() {
  const dispatch = useDispatch()
  const account = useSelector((state: RootState) => state.upgrade)
  const applicantId = useSelector((state: RootState) => state.upgrade.applicantId)
  const regularAdditionalData = useSelector((state: RootState) => state.upgrade.regularAdditionalData)

  const [showReport, setShowReport] = useState<IProfileData>()
  const { isLoading, execute: executeFullProfile } = useAPIWithToken<IProfileDataRes>()
  const { execute: upgrade } = useAPIWithToken<IUpgradeRes>()

  useEffect(() => {
    fetchFullProfile()
  }, [])

  const fetchFullProfile = async () => {
    try {
      const res = await executeFullProfile({
        method: 'POST',
        url: postFullProfile,
        data: { applicantId },
      })
      setShowReport(res?.data)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try {
      const res = await upgrade({
        method: 'POST',
        url: postUpgradeToRegular,
        data: {
          applicantId: applicantId,
          regularAdditionalData: {
            ...regularAdditionalData,
            monthlyIncome: Number(regularAdditionalData.monthlyIncome),
          },
        },
      })

      if (res) {
        router.push('/admin/onboarding/upgrade/upgrade-success')
        toast.success('Successfully Upgraded')
      }
    } catch (error) {
      toast.error('Unknown error')
      console.log('err', error)
    }
  }

  const handlePrevStep = () => {
    dispatch(decrement())
  }

  return (
    <>
      <div className="container my-33 mx-auto px-4 md:px-12 bg-white">
        <div className="container m-auto mt-8 overflow-x-auto">
          <div className="flex flex-col w-full rounded-lg py-8 gap-y-3 ">
            <div className="bg-gry">
              <label>Personal Information</label>
              <div className="mt-2 border-b-2 m-auto border-indigo-500 "></div>
              <div className=" mt-2">
                <Row>
                  <>
                    <TextRow label="Account ID" value={showReport?.account.id} />
                    <TextRow label="Account Title " value={showReport?.account.title} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Monthly Income  " value={account.regularAdditionalData.monthlyIncome} />
                    <TextRow label="Source Of Fund" value={account.regularAdditionalData.sourceOfFund} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Nationality " value={account.regularAdditionalData.nationality} />
                  </>
                </Row>
              </div>
              <div className=" mt-2 bg-gry">
                <span className="flex justify-start gap-5 items-center">
                  Risk Grading
                  {account.regularAdditionalData.riskInfo.length === 0 ? (
                    <FaTimes size={20} color="5E7AD4" />
                  ) : (
                    <FaCheck size={20} color="5E7AD4" />
                  )}
                </span>
              </div>
              <div className="mt-2 border-b-2 m-auto border-indigo-500 "></div>
              <div className="bg-gry mt-5">
                <label>Additional File</label>
                <div className="mt-2 border-b-2 m-auto border-indigo-500 "></div>
                <div className="font-normal text-md text-center items-center gap-20 flex flex-col sm:flex-row justify-center pb-8">
                  <div className="bg-gry mt-5">
                    <label className=" font-bold">FATCA</label>
                    {account.regularAdditionalData.fatca.data ? (
                      <FaCheck size={90} color="5E7AD4" />
                    ) : (
                      <FaTimes size={90} color="5E7AD4" />
                    )}
                  </div>
                  <div className="bg-gry mt-5">
                    <label className=" font-bold">AML</label>
                    {account.regularAdditionalData.aml.data ? (
                      <FaCheck size={90} color="5E7AD4" />
                    ) : (
                      <FaTimes size={90} color="5E7AD4" />
                    )}
                  </div>
                  <div className="bg-gry mt-5">
                    <label className=" font-bold">EDD</label>
                    {account.regularAdditionalData.edd.data ? (
                      <FaCheck size={90} color="5E7AD4" />
                    ) : (
                      <FaTimes size={90} color="5E7AD4" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-4 flex-col justify-center items-center">
            <div className="w-1/3">
              <Button id="button" label="Next" onClick={onSubmit} disable={isLoading} />
            </div>
            <div className="mb-10">
              <PrevButton onPrevStep={handlePrevStep} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
