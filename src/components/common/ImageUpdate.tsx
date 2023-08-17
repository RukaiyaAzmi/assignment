import React from 'react'
import Image from 'next/image'
import { AiFillEdit } from 'react-icons/ai'

interface ImageUpdateProps {
  url: string
  onUpdate: (data: string, mime: string) => void
}

export default function ImageUpdate({ url, onUpdate }: ImageUpdateProps): JSX.Element {
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files?.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file: File = e.target.files![0]
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onloadend = () => {
        const base64 = fileReader.result as string
        onUpdate(base64, file.type)
      }
    }
  }
  return (
    <div className="relative w-64 h-64 group rounded-lg overflow-hidden">
      <Image fill src={url} alt="Image" placeholder="blur" blurDataURL="/img/placeholder_nominee_photo.png" />
      <div className="flex gap-8 justify-center absolute bottom-0 z-10 text-gray-100 bg-zinc-600 w-full text-center p-6 opacity-0 group-hover:opacity-90 transition ease-in-out delay-100">
        <p className="hover:text-custom-brown active:text-gray-700">
          <label htmlFor="file-uploader">
            <AiFillEdit className=" text-4xl cursor-pointer" />
          </label>
          <input type="file" id="file-uploader" hidden onChange={onFileChange} accept="image/png, image/jpeg" />
        </p>
      </div>
    </div>
  )
}
