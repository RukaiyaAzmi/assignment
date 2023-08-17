import React, { useEffect, useState } from 'react'
import { FileInput, Label } from 'flowbite-react'
import { AiOutlineCloudUpload } from 'react-icons/ai'

export interface ImageUploadProps {
  label?: string
  helperText: string
  multiple?: boolean
  accept?: string
  onSubmit: (fileList: FileList | null | undefined) => void
}

export default function ImageUpload({
  label = 'Upload Image',
  helperText,
  multiple = false,
  accept = 'image/png, image/jpeg',
  onSubmit,
}: ImageUploadProps): JSX.Element {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>()
  const [base64List, setBase64List] = useState<string[]>([])

  useEffect(() => {
    if (selectedFiles) {
      const imgArr: string[] = []
      ;[...selectedFiles].forEach((f) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          imgArr.push(reader.result as string)
          if (selectedFiles.length === imgArr.length) setBase64List(imgArr)
        }
        reader.readAsDataURL(f)
      })
    }
  }, [selectedFiles])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files)
  }

  const onFileUpload = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    onSubmit(selectedFiles)
  }

  return (
    <div className=" flex flex-col gap-4 border rounded-lg p-4">
      <div className=" flex justify-center items-center gap-3 flex-wrap">
        {base64List.map((b64, i) => (
          <div
            className="flex flex-none w-24 h-24 border-2 border-dashed border-purple-400 rounded-lg overflow-hidden"
            key={i}
          >
            <img src={b64} alt="image" className="shrink-0 min-w-full min-h-full" />
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="border-2 border-dashed p-4 rounded-lg flex-1">
          <div className="mb-2 block">
            <Label htmlFor="file" value={label} />
          </div>
          <FileInput id="file" helperText={helperText} multiple={multiple} accept={accept} onChange={onFileChange} />
        </div>
        <div
          className="p-8 flex flex-col gap-2 justify-center items-center cursor-pointer group"
          onClick={onFileUpload}
        >
          <AiOutlineCloudUpload className="text-6xl text-gray-700 group-hover:text-custom-brown" />
          <p className="text-gray-700 font-medium text-lg group-hover:text-custom-brown">Upload</p>
        </div>
      </div>
    </div>
  )
}
