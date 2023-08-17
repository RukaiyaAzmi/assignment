import Button from '@components/common/Button'
import ImageUploadCapture from '@components/common/ImageUploadCapture'
import ImageUploader from '@components/common/ImageUploader'
import PrevButton from '@components/common/PrevButton'
import { putEkycTemp } from '@config/urls.config'
import { useAPIWithToken } from '@hooks/useAPI'
import { ITempDataRes } from '@interfaces/onboarding.interface'
import { decrement, increment, setApplicatFile } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import { imageConverter } from '@utils/converter.utils'
import { Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function CustomerPhoto() {
  const dispatch = useDispatch()
  const applicantFile = useSelector((state: RootState) => state.ekyc.applicantFile)
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const [showNextBtn, setShowNextBtn] = useState<boolean>(false)
  const tempStorageId = useSelector((state: RootState) => state.ekyc.tempStorageId)
  const step = useSelector((state: RootState) => state.ekyc.step)

  const { isLoading, execute: executeTempData } = useAPIWithToken<ITempDataRes>()

  useEffect(() => {
    if (applicantFile.photo !== '') {
      setShowNextBtn(true)
    }
  }, [])

  const handleUpload = (image: string, type: string, name: string) => {
    const base64 = image.split(',')[1]
    const obj = {
      name: name,
      value: base64,
    }
    dispatch(setApplicatFile(obj))
    setShowNextBtn(true)
  }

  const handleConfirm = (image: string): void => {
    setShowNextBtn(true)
    const obj = {
      name: 'photo',
      value: image.split(',')[1],
    }
    dispatch(setApplicatFile(obj))
  }

  const handleNextStep = async () => {
    if (applicantFile.photo !== '') {
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
      toast.error('Please Provide an Image')
    }
  }
  const handlePrevStep = () => {
    dispatch(decrement())
  }

  const handleShowDetailsModal = async () => {
    setShowDetailsModal(true)
  }

  const handleDetailsClose = () => {
    setShowDetailsModal(false)
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 mt-12 animate__animated animate__fadeIn">
        <h4 className="text-2xl mb-4 font-semibold capitalize">Provide Customer Photo</h4>
        <div className="mx-4 flex flex-col gap-4 w-2/3 lg:flex-row lg:w-1/3">
          <ImageUploader
            url={applicantFile.photo ? imageConverter(applicantFile.photo) : '/img/placeholder_nominee_photo@2x.png'}
            name="photo"
            onUpdate={handleUpload}
            title="Photo"
          />
        </div>

        <div className="inline-flex items-center justify-center w-full my-5">
          <hr className="w-64 h-px bg-gray-400 border-0 dark:bg-gray-700" />
          <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-gray-100 left-1/2 dark:text-white dark:bg-gray-900">
            OR
          </span>
        </div>
        <div className="w-1/3">
          <Button id="button" label="Capture Photo" onClick={handleShowDetailsModal} />
        </div>
      </div>

      <ImageUploadCapture
        onConfirm={handleConfirm}
        label="Next"
        showModal={showDetailsModal}
        onCloseModal={handleDetailsClose}
      />
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner color="purple" aria-label="Loading" size="xl" />
        </div>
      ) : (
        ''
      )}

      <div className="flex flex-col justify-center items-center">
        {showNextBtn && (
          <div className="w-1/3">
            <Button id="button" label="Next" disable={isLoading} onClick={handleNextStep} />
          </div>
        )}
        <div className="mt-4 mb-10">
          <PrevButton onPrevStep={handlePrevStep} />
        </div>
      </div>
    </>
  )
}
