import Button from '@components/common/Button'
import FileUploader from '@components/common/FileUploader'
import PrevButton from '@components/common/PrevButton'
import { putEkycTemp } from '@config/urls.config'
import { useAPIWithToken } from '@hooks/useAPI'
import { ITempDataRes } from '@interfaces/onboarding.interface'
import { decrement, increment, setAdditionalFile } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import { imageConverter } from '@utils/converter.utils'
import { Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function AdditionalFile() {
  const dispatch = useDispatch()
  const regularAdditionalData = useSelector((state: RootState) => state.ekyc.regularAdditionalData)
  const [fatca, setFatca] = useState('')
  const [aml, setAml] = useState('')
  const [edd, setEdd] = useState('')

  useEffect(() => {
    if (regularAdditionalData.fatca.data !== '') {
      regularAdditionalData.fatca.fileType === 'application/pdf'
        ? setFatca('/icon/pdf.svg')
        : setFatca(imageConverter(regularAdditionalData.fatca.data))
    }
    if (regularAdditionalData.aml.data !== '') {
      regularAdditionalData.aml.fileType === 'application/pdf'
        ? setAml('/icon/pdf.svg')
        : setAml(imageConverter(regularAdditionalData.aml.data))
    }
    if (regularAdditionalData.edd.data !== '') {
      regularAdditionalData.edd.fileType === 'application/pdf'
        ? setEdd('/icon/pdf.svg')
        : setEdd(imageConverter(regularAdditionalData.edd.data))
    }
  }, [])

  const tempStorageId = useSelector((state: RootState) => state.ekyc.tempStorageId)
  const step = useSelector((state: RootState) => state.ekyc.step)
  const { isLoading, execute: executeTempData } = useAPIWithToken<ITempDataRes>()
  const handleUpload = (image: string, type: string, name: string) => {
    const base64 = image.split(',')[1]
    const obj = {
      name: name,
      type: type,
      value: base64,
    }
    dispatch(setAdditionalFile(obj))

    if (name === 'fatca') {
      type === 'application/pdf' ? setFatca('/icon/pdf.svg') : setFatca(image)
    } else if (name === 'aml') {
      type === 'application/pdf' ? setAml('/icon/pdf.svg') : setAml(image)
    } else if (name === 'edd') {
      type === 'application/pdf' ? setEdd('/icon/pdf.svg') : setEdd(image)
    }
  }

  const handleNextStep = async () => {
    if (regularAdditionalData.fatca.data === '') {
      toast.error('Please Provide fatca')
      return
    }
    if (regularAdditionalData.aml.data === '') {
      toast.error('Please Provide aml')
      return
    }
    const tempRes = await executeTempData({
      method: 'PUT',
      url: putEkycTemp,
      params: {
        id: tempStorageId,
      },
      data: {
        data: {
          step: step + 1,
          regularAdditionalData: regularAdditionalData,
        },
      },
    })

    if (tempRes) {
      dispatch(increment())
    }
  }
  const handlePrevStep = () => {
    dispatch(decrement())
  }

  return (
    <>
      <div className="mx-4 flex flex-col justify-center items-center gap-4 mt-12 animate__animated animate__fadeIn">
        <h4 className="text-2xl mb-4 font-semibold capitalize">Additional File Upload</h4>
        <div className="flex flex-col gap-4 w-2/3 lg:flex-row lg:w-full">
          <FileUploader
            url={fatca ? fatca : '/img/kyc_file.png'}
            name="fatca"
            onUpdate={handleUpload}
            title="FATCA"
            accept="image/png, image/jpeg, application/pdf"
          />
          <FileUploader
            url={aml ? aml : '/img/kyc_file.png'}
            name="aml"
            onUpdate={handleUpload}
            title="AML"
            accept="image/png, image/jpeg, application/pdf"
          />
          <FileUploader
            url={edd ? edd : '/img/kyc_file.png'}
            name="edd"
            onUpdate={handleUpload}
            title="EDD"
            accept="image/png, image/jpeg, application/pdf"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Spinner color="purple" aria-label="Loading" size="xl" />
        </div>
      ) : (
        ''
      )}

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
