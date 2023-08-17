import React from 'react'
import Image from 'next/image'
import { MdUpload } from 'react-icons/md'
import { AiOutlineCheckSquare } from 'react-icons/ai'
import { byteToMB } from '@utils/converter.utils'
import { toast } from 'react-toastify'

interface ImageUploaderProps {
  url: string
  onUpdate: (data: string, mime: string, name: string) => void
  name: string
  title?: string
  index?: number
  sizeLimit?: number
  error?: string
}

export default function ImageUploader({
  url,
  onUpdate,
  name,
  title,
  index,
  sizeLimit = 0.5,
  error,
}: ImageUploaderProps) {
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
        onUpdate(base64, file.type, name)
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
              <input type="file" id={getId()} hidden onChange={onFileChange} accept="image/png, image/jpeg" />
            </div>
          </div>
        </div>
      </div>
      {error !== undefined ? (
        <p className="flex gap-1 items-center py-1 text-sm text-red-400">
          <span>
            <AiOutlineCheckSquare />
          </span>
          {error}
        </p>
      ) : (
        ''
      )}
    </>
  )
}
