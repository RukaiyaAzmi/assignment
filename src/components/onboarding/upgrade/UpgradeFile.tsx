import Button from '@components/common/Button'
import FileUploader from '@components/common/FileUploader'
import PrevButton from '@components/common/PrevButton'
import { decrement, increment } from '@redux/slices/upgrade.slice'
import { setFileData, setFileName, setFileType } from '@redux/slices/upgrade.slice'
import { RootState } from '@redux/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function UpgradeFile() {
  const flag = 'data:image/jpeg;base64,'
  const dispatch = useDispatch()
  const file = useSelector((state: RootState) => state.upgrade)

  const handleUpload = (image: string, type: string, name: string, fileName: string) => {
    const obj = {
      name: name,
      value: image.split(',')[1],
    }
    const objType = {
      name: name,
      value: type,
    }
    const objName = {
      name: name,
      value: fileName,
    }
    dispatch(setFileData(obj))
    dispatch(setFileType(objType))
    dispatch(setFileName(objName))
  }

  const handleNextStep = () => {
    if (file.regularAdditionalData.fatca.data === '') {
      toast.error('Please Provide FATCA')
      return
    }
    if (file.regularAdditionalData.aml.data === '') {
      toast.error('Please Provide AML')
      return
    }
    if (file.regularAdditionalData.edd.data === '') {
      toast.error('Please Provide EDD')
      return
    }
    dispatch(increment())
  }
  const handlePrevStep = () => {
    dispatch(decrement())
  }

  return (
    <>
      <div className="mx-4 flex flex-col justify-center items-center gap-4 mt-12">
        <h4 className="text-2xl mb-4 font-semibold capitalize">Additional File Upload</h4>
        <div className="flex flex-col gap-4 w-2/3 lg:flex-row lg:w-full">
          <FileUploader
            url={
              file.regularAdditionalData.fatca.data
                ? file.regularAdditionalData.fatca.fileType === 'application/pdf'
                  ? '/icon/pdf.svg'
                  : flag + file.regularAdditionalData.fatca.data
                : '/img/kyc_file.png'
            }
            name="fatca"
            onUpdate={handleUpload}
            title="FATCA"
            accept="image/png, image/jpeg, application/pdf"
          />
          <FileUploader
            url={
              file.regularAdditionalData.aml.data
                ? file.regularAdditionalData.aml.fileType === 'application/pdf'
                  ? '/icon/pdf.svg'
                  : flag + file.regularAdditionalData.aml.data
                : '/img/kyc_file.png'
            }
            name="aml"
            onUpdate={handleUpload}
            title="AML"
            accept="image/png, image/jpeg, application/pdf"
          />
          <FileUploader
            url={
              file.regularAdditionalData.edd.data
                ? file.regularAdditionalData.edd.fileType === 'application/pdf'
                  ? '/icon/pdf.svg'
                  : flag + file.regularAdditionalData.edd.data
                : '/img/kyc_file.png'
            }
            name="edd"
            onUpdate={handleUpload}
            title="EDD"
            accept="image/png, image/jpeg, application/pdf"
          />
        </div>
      </div>

      <div className="flex mt-4 flex-col justify-center items-center">
        <div className="w-1/3">
          <Button id="button" label="Next" onClick={() => handleNextStep()} />
        </div>
        <div className="mb-10">
          <PrevButton onPrevStep={handlePrevStep} />
        </div>
      </div>
    </>
  )
}
