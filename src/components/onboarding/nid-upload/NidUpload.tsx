import Button from '@components/common/Button'
import ImageUploadCapture from '@components/common/ImageUploadCapture'
import ImageUploader from '@components/common/ImageUploader'
import InlineButton from '@components/common/InlineButton'
import PrevButton from '@components/common/PrevButton'
import { postNidOcr, putEkycTemp } from '@config/urls.config'
import { useAPIWithToken } from '@hooks/useAPI'
import { INidOcrRes, ITempDataRes } from '@interfaces/onboarding.interface'
import { decrement, increment, setApplicatFile, setNidOcr } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import { imageConverter } from '@utils/converter.utils'
import { Label, Radio, Spinner } from 'flowbite-react'
import React, { useState } from 'react'
import { AiOutlineScan } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { isValid } from 'date-fns'

const radioTheme = {
  root: {
    base: 'checked:text-indigo-500 checked:outline-indigo-500',
  },
}

export default function NidUpload() {
  const [showNidFrontModal, setShowNidFrontModal] = useState<boolean>(false)
  const [nidType, setNidType] = useState<'N' | 'O'>('N')
  const [showNidBackModal, setShowNidBackModal] = useState<boolean>(false)
  const dispatch = useDispatch()
  const applicantFile = useSelector((state: RootState) => state.ekyc.applicantFile)
  const applicant = useSelector((state: RootState) => state.ekyc.applicant)
  const tempStorageId = useSelector((state: RootState) => state.ekyc.tempStorageId)
  const step = useSelector((state: RootState) => state.ekyc.step)

  const { isLoading, execute: executeTempData } = useAPIWithToken<ITempDataRes>()
  const { isLoading: isNidOcrLoading, execute: executeNidOcr } = useAPIWithToken<INidOcrRes>()
  const handleUpload = (image: string, type: string, name: string) => {
    const base64 = image.split(',')[1]
    const obj = {
      name: name,
      value: base64,
    }
    dispatch(setApplicatFile(obj))
  }

  const handleNextStep = async () => {
    if (applicantFile.nidFront && applicantFile.nidBack) {
      try {
        const tempRes = await executeTempData({
          method: 'PUT',
          url: putEkycTemp,
          params: {
            id: tempStorageId,
          },
          data: {
            data: {
              step: step + 1,
              applicant: {
                nid: applicant.nid,
                dob: applicant.dob,
                dobDate: applicant.dobDate,
              },
              applicantFile: applicantFile,
            },
          },
        })
        if (tempRes) {
          dispatch(increment())
        }
      } catch (error) {
        toast.error('Unknown Error')
      }
    } else {
      toast.error('Please Upload NID')
    }
  }
  const handlePrevStep = () => {
    dispatch(decrement())
  }

  const handleShowFrontNidModal = () => {
    setShowNidBackModal(false)
    setShowNidFrontModal(true)
  }

  const handleShowBackNidModal = () => {
    setShowNidBackModal(true)
    setShowNidFrontModal(false)
  }

  const handleNidFrontConfirm = (image: string) => {
    const obj = {
      name: 'nidFront',
      value: image.split(',')[1],
    }
    dispatch(setApplicatFile(obj))
  }

  const handleNidFrontCloseModal = () => {
    setShowNidFrontModal(false)
  }

  const handleNidBackConfirm = (image: string) => {
    const obj = {
      name: 'nidBack',
      value: image.split(',')[1],
    }
    dispatch(setApplicatFile(obj))
  }

  const handleNidBackCloseModal = () => {
    setShowNidBackModal(false)
  }

  const handleNidOcr = async () => {
    if (applicantFile.nidFront !== '' && applicantFile.nidBack !== '') {
      try {
        const res = await executeNidOcr({
          method: 'POST',
          url: postNidOcr,
          data: {
            nidFront: applicantFile.nidFront,
            nidBack: applicantFile.nidBack,
            nidType: nidType,
          },
        })
        const isDateValid = isValid(new Date(res?.data.formatted.dob ?? ''))
        if (res && res.data.nidFront.nid && isDateValid) {
          const data = {
            nid: res?.data.nidFront.nid,
            dob: res?.data.formatted.dob,
            dobDate: new Date(res?.data.formatted.dob).toISOString(),
          }
          dispatch(setNidOcr(data))
          toast.success('OCR Successful')
        } else toast.error('OCR Failed, Please Check Your Image')
      } catch (error) {
        toast.error('Unknown Error')
      }
    } else {
      toast.error('Please Upload or Capture NID First')
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 mt-4 animate__animated animate__fadeIn">
        <h4 className="text-2xl mb-4 font-semibold capitalize">upload NID</h4>
        <div className="mx-4 w-full flex flex-col gap-4 justify-center items-center lg:flex-row ">
          <div className="flex flex-col w-2/3 lg:w-1/3 space-y-3">
            <ImageUploader
              url={applicantFile.nidFront ? imageConverter(applicantFile.nidFront) : '/icon/icon_nid_front.svg'}
              name="nidFront"
              onUpdate={handleUpload}
              title="NID front"
            />
            <Button id="button" label="Capture NID Front" onClick={handleShowFrontNidModal} />
          </div>

          <div className="flex flex-col w-2/3 lg:w-1/3 space-y-3">
            <ImageUploader
              url={applicantFile.nidBack ? imageConverter(applicantFile.nidBack) : '/icon/icon_nid_back.svg'}
              name="nidBack"
              onUpdate={handleUpload}
              title="NID back"
            />
            <Button id="button" label="Capture NID Back" onClick={handleShowBackNidModal} />
          </div>
        </div>

        <ImageUploadCapture
          onConfirm={handleNidFrontConfirm}
          label="Next"
          showModal={showNidFrontModal}
          onCloseModal={handleNidFrontCloseModal}
        />
        <ImageUploadCapture
          onConfirm={handleNidBackConfirm}
          label="Next"
          showModal={showNidBackModal}
          onCloseModal={handleNidBackCloseModal}
        />
      </div>
      {isLoading || isNidOcrLoading ? (
        <div className="flex justify-center">
          <Spinner color="purple" aria-label="Loading" size="xl" />
        </div>
      ) : (
        ''
      )}
      <div className="flex justify-center items-center">
        <div className="bg-white border rounded-md flex flex-col justify-center p-4 sm:w-2/3 sm:flex-row ">
          <div className="flex gap-4 mr-4">
            <Radio defaultChecked id="new" name="nid" value="N" theme={radioTheme} onClick={() => setNidType('N')} />
            <Label htmlFor="new">New</Label>
          </div>
          <div className="flex gap-4">
            <Radio id="old" name="nid" value="O" theme={radioTheme} onClick={() => setNidType('O')} />
            <Label htmlFor="old">Old</Label>
          </div>
          <div className="sm:ml-4">
            <InlineButton
              disabled={isNidOcrLoading}
              icon={<AiOutlineScan className="text-lg" />}
              value="OCR"
              onClick={handleNidOcr}
              color="bg-rose-400 hover:bg-rose-500"
              width="w-32"
            />
          </div>
        </div>
      </div>

      <div className="flex mt-4 flex-col justify-center items-center">
        <div className="w-1/3">
          <Button id="button" label="Next" disable={isLoading} onClick={handleNextStep} />
        </div>
        <div className="mt-4 mb-10">
          <PrevButton onPrevStep={handlePrevStep} />
        </div>
      </div>
    </>
  )
}
