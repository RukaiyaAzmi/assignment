import { imageConverter } from '@utils/converter.utils'
import React from 'react'

interface ImagePreviewProps {
  data?: string
  url?: string
  label: string
}

export default function ImagePreview({ data, url, label }: ImagePreviewProps) {
  return (
    <div>
      <label className="flex justify-center items-center" htmlFor={label}>
        {label}
      </label>
      <img id={label} src={data ? imageConverter(data) : url} className="rounded-lg w-60 h-40" alt="Image" />
    </div>
  )
}
