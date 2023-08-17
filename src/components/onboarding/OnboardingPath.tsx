import { RootState } from '@redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import MobileVerificationRouter from './mobile-verificaiton/MobileVerificationRouter'
import DedupeRouter from './dedupe/DedupeRouter'
import AccountRouter from './account/AccountRouter'
import NidUploadRouter from './nid-upload/NidUploadRouter'
import PersonalInfoRouter from './personal-information/PersonalInfoRouter'
import NomineeInfoRouter from './nominee/NomineeInfoRouter'
import NidVerificationRouter from './nid-verification/NidVerificationRouter'
import PhotoRouter from './photo/PhotoRouter'
import SignatureRouter from './signature/SignatureRouter'
import RiskGradingRouter from './risk-grading/RiskGradingRouter'
import PreviewRouter from './preview/PreviewRouter'
import AdditionalFileRouter from './additional-file/AdditionalFileRouter'
import { Progress } from 'flowbite-react'

export interface WithProgressProps {
  children: JSX.Element
}

function WithProgress({ children }: WithProgressProps): JSX.Element {
  const step = useSelector((state: RootState) => state.ekyc.step)
  const stepWeight = useSelector((state: RootState) => state.ekyc.stepWeight)
  return (
    <div className="flex flex-col gap-4 my-5">
      <Progress
        labelProgress
        size="lg"
        progressLabelPosition="inside"
        color="indigo"
        progress={Math.floor(step * stepWeight)}
        className=" mx-auto w-full lg:w-2/3"
      />
      {children}
    </div>
  )
}

export default function OnboardingPath() {
  const step = useSelector((state: RootState) => state.ekyc.step)
  switch (step) {
    case 1:
      return (
        <WithProgress>
          <MobileVerificationRouter />
        </WithProgress>
      )
    case 2:
      return (
        <WithProgress>
          <AccountRouter />
        </WithProgress>
      )
    case 3:
      return (
        <WithProgress>
          <NidUploadRouter />
        </WithProgress>
      )
    case 4:
      return (
        <WithProgress>
          <DedupeRouter />
        </WithProgress>
      )
    case 5:
      return (
        <WithProgress>
          <NidVerificationRouter />
        </WithProgress>
      )
    case 6:
      return (
        <WithProgress>
          <PersonalInfoRouter />
        </WithProgress>
      )
    case 7:
      return (
        <WithProgress>
          <NomineeInfoRouter />
        </WithProgress>
      )
    case 8:
      return (
        <WithProgress>
          <PhotoRouter />
        </WithProgress>
      )
    case 9:
      return (
        <WithProgress>
          <SignatureRouter />
        </WithProgress>
      )
    case 10:
      return (
        <WithProgress>
          <RiskGradingRouter />
        </WithProgress>
      )
    case 11:
      return (
        <WithProgress>
          <AdditionalFileRouter />
        </WithProgress>
      )
    case 12:
      return (
        <WithProgress>
          <PreviewRouter />
        </WithProgress>
      )
    default:
      return <div></div>
  }
}
