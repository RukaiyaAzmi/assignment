import React from 'react'
import Image from 'next/image'
import { MdUpload } from 'react-icons/md'
import { byteToMB } from '@utils/converter.utils'
import { toast } from 'react-toastify'

interface FileUploaderProps {
  url: string
  onUpdate: (data: string, mime: string, name: string, fileName: string) => void
  name: string
  title?: string
  index?: number
  sizeLimit?: number
  accept?: string
}

export default function FileUploader({
  url,
  onUpdate,
  name,
  title,
  index,
  sizeLimit = 0.5,
  accept,
}: FileUploaderProps) {
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file: File = e.target.files![0]
      if (byteToMB(file.size) > sizeLimit) {
        toast.error('File size limit exceeded')
        return
      }
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onloadend = () => {
        const base64 = fileReader.result as string
        onUpdate(base64, file.type, name, file.name)
      }
    }
  }

  const getId = () => {
    return `${name}-${index}`
  }

  return (
    <>
      <div className="w-full h-[15rem] border-4 border-gray-300 border-dashed bg-white rounded-md">
        {title && <h3 className="capitalize text-center mt-5 mb-2 font-semibold text-xl">{title}</h3>}
        <div className={`h-full flex justify-center ${title ? '' : 'items-center'}`}>
          <div className="relative w-[13rem] h-[8rem]">
            <Image
              fill
              src={url}
              className="rounded-lg"
              alt="Image"
              placeholder="blur"
              blurDataURL="/img/placeholder_nominee_photo.png"
            />

            <div className="absolute w-12 h-12 bottom-[-21px] left-[85px] bg-white shadow-md rounded-full">
              <label htmlFor={getId()} className="flex justify-center mt-2">
                <MdUpload className=" text-3xl cursor-pointer text-indigo-500" />
              </label>
              <input type="file" id={getId()} hidden onChange={onFileChange} accept={accept} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
