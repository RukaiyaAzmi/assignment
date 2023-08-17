import DateInput from '@components/common/DateInput'
import ImageUploader from '@components/common/ImageUploader'
import SelectBox, { IOptionsData } from '@components/common/SelectBox'
import TextInputWithLabel from '@components/common/TextInputWithLabel'
import { useFormValidationAsync } from '@hooks/useFormValidation'
import { EKYCState, removeNominee, setNominee, setNomineeGuardian } from '@redux/slices/ekyc.slice'
import { RootState } from '@redux/store'
import { getRelationData } from '@utils/relation.utils'
import { Button, Modal } from 'flowbite-react'
import Joi from 'joi'
import React, { useEffect, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { CiCircleAlert } from 'react-icons/ci'
import { useDispatch, useSelector } from 'react-redux'

export type NomineeType = EKYCState['nominees'][0]

interface NomineeProps {
  index: number
  data: NomineeType
}

export const schema: Joi.Schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  fatherName: Joi.string().min(3).max(50).required(),
  docNo: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(3)
    .max(50)
    .required(),
  percentage: Joi.number().min(1).max(100).required(),
  motherName: Joi.string().min(3).max(50).required(),
  docType: Joi.string().min(1).required(),
  dob: Joi.string().required(),
  relation: Joi.string().min(3).max(50).required(),
  isMinor: Joi.boolean(),
  photo: Joi.string().base64().required(),
  docFrontImage: Joi.string().base64().required(),
  docBackImage: Joi.string().base64().required(),
})

const gurdianSchema: Joi.Schema = Joi.object({
  guardianPhoto: Joi.string().required(),
  guardianName: Joi.string().min(3).max(50).required(),
  guardianNid: Joi.alternatives().try(
    Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    Joi.string()
      .length(17)
      .pattern(/^[0-9]+$/)
      .required(),
  ),
  guardianAddress: Joi.string().min(1).required(),
  guardianRelation: Joi.string().min(3).max(50).required(),
})

export default function Nominee({ data, index }: NomineeProps): JSX.Element {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [relation, setRelation] = useState<IOptionsData[]>([])
  const channelCode = useSelector((state: RootState) => state.ekyc.account.channelCode)
  const dispatch = useDispatch()
  const relationData = useSelector((state: RootState) => state.ekyc.nominees[index])

  const [guardian, setGuardian] = useState({
    guardianPhoto: relationData.guardian?.photo ?? '',
    guardianName: relationData.guardian?.name ?? '',
    guardianNid: relationData.guardian?.nid ?? '',
    guardianAddress: relationData.guardian?.address ?? '',
    guardianRelation: relationData.guardian?.relation ?? '',
  })

  const { errors } = useFormValidationAsync(
    schema,
    relationData,
    {
      abortEarly: true,
      allowUnknown: true,
    },
    true,
  )
  const { errors: guardianErrors } = useFormValidationAsync(gurdianSchema, guardian, {
    abortEarly: true,
  })

  useEffect(() => {
    getRelationData(channelCode).then((d) => setRelation(d))
  }, [])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number | boolean = ''
    if (e.target.name === 'percentage') value = parseInt(e.target.value)
    else value = e.target.value
    dispatch(
      setNominee({
        index,
        name: e.target.name,
        value: value,
      }),
    )
  }

  const onGuardianInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name = ''
    if (e.target.name === 'guardianName') name = 'name'
    if (e.target.name === 'guardianNid') name = 'nid'
    if (e.target.name === 'guardianAddress') name = 'address'
    setGuardian({ ...guardian, [e.target.name]: e.target.value })
    dispatch(
      setNomineeGuardian({
        index,
        name: name,
        value: e.target.value,
      }),
    )
  }

  const onDateChange = (d: Date) => {
    dispatch(
      setNominee({
        index,
        name: 'dob',
        value: d.toISOString(),
      }),
    )
  }

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      setNominee({
        index,
        name: e.target.name,
        value: e.target.value,
      }),
    )
  }

  const onGuardianSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let name = ''
    if (e.target.name === 'guardianRelation') name = 'relation'
    setGuardian({ ...guardian, [e.target.name]: e.target.value })
    dispatch(
      setNomineeGuardian({
        index,
        name: name,
        value: e.target.value,
      }),
    )
  }

  const onNomineeImageUpdate = (base64Data: string, mimeType: string, name: string) => {
    dispatch(
      setNominee({
        index,
        name: name,
        value: base64Data.split(',')[1],
      }),
    )
  }

  const onGuardianImageUpdate = (base64Data: string) => {
    dispatch(
      setNomineeGuardian({
        index,
        name: 'photo',
        value: base64Data.split(',')[1],
      }),
    )
    setGuardian({ ...guardian, guardianPhoto: base64Data.split(',')[1] })
  }

  const prepareBase64Image = (base64Raw): string | undefined => {
    if (base64Raw && base64Raw !== '') {
      return `data:image/png;base64,${base64Raw}`
    }
    return undefined
  }

  const handleDeleteModalCancel = () => {
    setShowDeleteModal(false)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  return (
    <>
      <div className="w-full rounded-md p-4 animate__animated animate__fadeIn">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-semibold">Nominee {index + 1}</h3>
          <AiFillDelete className="text-2xl text-red-400 cursor-pointer" onClick={handleDelete} />
        </div>

        {/** Image Section of Nominee */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4">
          <div>
            <ImageUploader
              url={prepareBase64Image(data.photo) ?? '/img/placeholder_nominee_photo@2x.png'}
              onUpdate={onNomineeImageUpdate}
              name="photo"
              title="Nominee Photo"
              error={errors['photo']}
              index={index}
            />
          </div>
          <div>
            <ImageUploader
              url={prepareBase64Image(data.docFrontImage) ?? '/icon/icon_nid_front.svg'}
              onUpdate={onNomineeImageUpdate}
              name="docFrontImage"
              title="Document Front Image"
              error={errors['docFrontImage']}
              index={index}
            />
          </div>
          <div>
            <ImageUploader
              url={prepareBase64Image(data.docBackImage) ?? '/icon/icon_nid_back.svg'}
              onUpdate={onNomineeImageUpdate}
              name="docBackImage"
              title="Document Back Image"
              error={errors['docBackImage']}
              index={index}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4">
          <div className="relative">
            <TextInputWithLabel
              id="name"
              placeholder="Enter Nominee Name"
              type="text"
              name="name"
              value={data.name}
              onChange={onInputChange}
              iconUrl="/icon/icon_forAllTextFild.svg"
              error={errors['name']}
              label="Nominee's Name"
              mandatory
            />
            <TextInputWithLabel
              id="percentage"
              placeholder="Enter Nominee Percentage"
              type="number"
              name="percentage"
              value={data.percentage}
              onChange={onInputChange}
              iconUrl="/icon/icon_forAllTextFild.svg"
              error={errors['percentage']}
              label="Nominee's Percentage"
              mandatory
              min={1}
              max={100}
            />
            <DateInput label="Date of Birth" onDateChange={onDateChange} isShow mandatory error={errors['dob']} />
          </div>
          <div>
            <TextInputWithLabel
              id="fatherName"
              placeholder="Enter Father Name"
              type="text"
              name="fatherName"
              value={data.fatherName}
              onChange={onInputChange}
              iconUrl="/icon/icon_forAllTextFild.svg"
              error={errors['fatherName']}
              label="Nominee's Father Name"
              mandatory
            />
            <TextInputWithLabel
              id="motherName"
              placeholder="Enter Mother Name"
              type="text"
              name="motherName"
              value={data.motherName}
              onChange={onInputChange}
              iconUrl="/icon/icon_forAllTextFild.svg"
              error={errors['motherName']}
              label="Nominee's Mother Name"
              mandatory
            />
            <SelectBox
              id="relation"
              name="relation"
              label="Relation"
              options={relation}
              onSelect={onSelectChange}
              selectText="Please Select Relation"
              value={data.relation}
              error={errors['relation']}
              mandatory
            />
          </div>
          <div>
            <TextInputWithLabel
              id="docNo"
              placeholder="Enter Document Number"
              type="number"
              name="docNo"
              value={data.docNo}
              onChange={onInputChange}
              iconUrl="/icon/icon_forAllTextFild.svg"
              error={errors['docNo']}
              label="Identity Document Number"
              mandatory
            />
            <SelectBox
              id="docType"
              name="docType"
              label="Identity Document Type"
              options={[
                { key: 'NID', value: 'NID' },
                { key: 'PASSPORT', value: 'Passport' },
                { key: 'BIRTH_CERTIFICATE', value: 'Birth Certificate' },
              ]}
              onSelect={onSelectChange}
              selectText="Please Select Type"
              value={data.docType}
              error={errors['docType']}
              mandatory
            />
          </div>
        </div>
        {data.isMinor && (
          <>
            <h3 className="text-md font-semibold p-4">Guardian of Nominee {index + 1}</h3>
            <div className="flex flex-col justify-center items-center gap-4 my-4">
              <ImageUploader
                url={prepareBase64Image(data.guardian?.photo) ?? '/img/placeholder_nominee_photo@2x.png'}
                onUpdate={onGuardianImageUpdate}
                name="guardianPhoto"
                title="Guardian Photo"
                error={guardianErrors['guardianPhoto']}
                index={index}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4">
              <div>
                <TextInputWithLabel
                  id="guardianName"
                  placeholder="Enter Name"
                  type="text"
                  name="guardianName"
                  value={data.guardian?.name}
                  onChange={onGuardianInputChange}
                  iconUrl="/icon/icon_forAllTextFild.svg"
                  error={guardianErrors['guardianName']}
                  label="Guardian's Name"
                  mandatory
                />
                <SelectBox
                  id="guardianRelation"
                  name="guardianRelation"
                  label="Relation"
                  options={relation}
                  onSelect={onGuardianSelectChange}
                  selectText="Please Select Relation"
                  value={data.guardian?.relation}
                  error={guardianErrors['guardianRelation']}
                  mandatory
                />
              </div>
              <div>
                <TextInputWithLabel
                  id="guardianNid"
                  placeholder="Enter NID"
                  type="text"
                  name="guardianNid"
                  value={data.guardian?.nid}
                  onChange={onGuardianInputChange}
                  iconUrl="/icon/icon_forAllTextFild.svg"
                  error={guardianErrors['guardianNid']}
                  label="Guardian's NID"
                  mandatory
                />
              </div>
              <div>
                <TextInputWithLabel
                  id="guardianAddress"
                  placeholder="Enter Address"
                  type="text"
                  name="guardianAddress"
                  value={data.guardian?.address}
                  onChange={onGuardianInputChange}
                  iconUrl="/icon/icon_forAllTextFild.svg"
                  error={guardianErrors['guardianAddress']}
                  label="Guardian's Address"
                  mandatory
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* <!--- Delete Modal Show ---> */}
      <Modal
        show={showDeleteModal}
        size="md"
        onClose={handleDeleteModalCancel}
        popup={true}
        position="top-center"
        dismissible={false}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <CiCircleAlert className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this Nominee?</h3>
            <div className="flex justify-center gap-4">
              <Button gradientDuoTone="pinkToOrange" outline onClick={() => dispatch(removeNominee(index))}>
                {`Yes, I'm sure`}
              </Button>
              <Button color="gray" onClick={handleDeleteModalCancel}>
                {`No, cancel`}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
