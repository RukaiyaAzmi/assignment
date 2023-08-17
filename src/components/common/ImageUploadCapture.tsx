import Button from '@components/common/Button'
import { Modal } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'

interface ImageUploadCaptureProps {
  onConfirm: (image: string) => void
  label?: string
  showModal: boolean
  onCloseModal: () => void
}

export default function ImageUploadCapture({ onConfirm, label, showModal, onCloseModal }: ImageUploadCaptureProps) {
  const [url, setUrl] = useState('/img/placeholder_nominee_photo@2x.png')

  const stream = useRef<MediaStream | null>(null)
  useEffect(() => {
    async function run() {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: {} })
      const videoEl = document.getElementById('inputVideo') as HTMLVideoElement
      if (stream.current && videoEl) videoEl.srcObject = stream.current
    }

    if (showModal) run()

    return () => {
      console.log('[INFO] Releasing Camera.')
      if (stream.current) {
        stream.current.getTracks().forEach(function (track) {
          track.stop()
        })
      }
    }
  }, [showModal])

  const onImageCapture = () => {
    const video = document.getElementById('inputVideo') as HTMLVideoElement
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 240
    canvas.getContext('2d')?.drawImage(video, 0, 0, 320, 240)
    const imageRaw = canvas.toDataURL('image/jpeg')
    setUrl(imageRaw)
  }

  const onImageConfirm = () => {
    if (typeof onConfirm === 'function') onConfirm(url)
    onCloseModal()
  }

  return (
    <>
      <Modal show={showModal} size="4xl" onClose={onCloseModal} popup={true} position="top-center" dismissible={false}>
        <Modal.Header className="bg-slate-100"></Modal.Header>
        <Modal.Body className=" bg-slate-100">
          {showModal && (
            <div className=" bg-slate-200 p-4 rounded-lg flex flex-col sm:flex-row justify-center items-center gap-4">
              {/* Left Panel of the design */}
              <div className="flex flex-col flex-1 justify-center items-center gap-4">
                <p className=" text-xl">Click to Capture an Image</p>
                <video className="rounded-lg" autoPlay width="320" height="240" id="inputVideo"></video>
                <Button id="button" label="Capture" onClick={onImageCapture} />
              </div>
              {/* Right Panel of the design */}
              <div className="flex flex-col flex-1 justify-center items-center gap-4">
                <p className=" text-xl">Image Captured</p>
                <img
                  className="rounded-lg w-[320px] h-[240px]"
                  width="320"
                  height="240"
                  id="imgCap"
                  alt="Captured Image"
                  src={url}
                />
                <Button id="button" label={label ?? 'Confirm'} onClick={onImageConfirm} />
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
