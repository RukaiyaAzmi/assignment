import React, { useEffect, useState } from 'react'
import { useAPIWithToken } from '@hooks/useAPI'
import {
  postAdditionalFiles,
  postFullProfile,
  postFullProfileDownload,
  postFullProfileDownloadReg,
} from '@config/urls.config'
import { toast } from 'react-toastify'
import Row from '@components/common/Row'
import TextRow from '@components/common/TextRow'
import { IProfileDataRes, IProfileData, IFiles } from '@interfaces/full-profile.interface'
import DateRow from '@components/common/DateRow'
import InlineButton from '@components/common/InlineButton'
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaDownload, FaGripfire } from 'react-icons/fa'
import { measureRisk } from '@utils/score.utils'
import ButtonCom from '@components/common/Button'
import { b64toBlob } from '@utils/file.utils'
import { getFullAccountType, getFullChanneltName, getFullGender, getFullVerificationStatus } from '@utils/status.utils'
import { saveAs } from 'file-saver'
import { useRouter } from 'next/router'
import RiskGradingReport from './RiskGradingReport'
import { getFullEkycType } from '@components/tp/TpList'
import { IAdditionalFileData, IAdditionalRes } from '@interfaces/additional.interface'
import { Button, Modal, Spinner } from 'flowbite-react'
import TextRowFull from '@components/common/TextRowFull'

interface FullProfileProps {
  applicantId: string
}

export default function FullProfile({ applicantId }: FullProfileProps): JSX.Element {
  const flag = 'data:image/jpeg;base64,'
  const router = useRouter()
  const [showReport, setShowReport] = useState<IProfileData>()
  const [showRisk, setShowRisk] = useState<boolean>(true)
  const [additionalFile, setAdditionalFile] = useState<IAdditionalFileData>()
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const [arrowUp, setArrowUp] = useState<boolean>(false)
  const [profileShow, setProfileShow] = useState<IFiles>()
  const { isLoading: isReportLoading, execute: executeDownloadPdfReport } = useAPIWithToken<Blob>()
  const { execute: executeFullProfile } = useAPIWithToken<IProfileDataRes>()
  const { execute: executeAdditionalfile } = useAPIWithToken<IAdditionalRes>()

  useEffect(() => {
    fetchFullProfile()
  }, [])

  const fetchFullProfile = async () => {
    try {
      const res = await executeFullProfile({
        method: 'POST',
        url: postFullProfile,
        data: { applicantId: applicantId },
      })
      setShowReport(res?.data)
      setProfileShow(res?.data.files)
      if (res?.data.riskGrading === null) return setShowRisk(false)
    } catch (error) {
      toast.error('Unknown error')
    }
  }
  //*******************************PDF Download*************************************** */
  const onDownloadFile = async () => {
    try {
      if (showReport?.riskGrading !== null) {
        const resPdf = await executeDownloadPdfReport({
          method: 'POST',
          url: postFullProfileDownloadReg,
          responseType: 'blob',
          headers: {
            Accept: 'application/pdf',
          },
          data: {
            applicantId: applicantId,
          },
        })
        if (resPdf) {
          const blob = new Blob([resPdf], { type: 'application/pdf' })
          saveAs(blob, `${showReport?.nid}.pdf`)
        }
      } else {
        const resPdf = await executeDownloadPdfReport({
          method: 'POST',
          url: postFullProfileDownload,
          responseType: 'blob',
          headers: {
            Accept: 'application/pdf',
          },
          data: {
            applicantId: applicantId,
          },
        })
        if (resPdf) {
          const blob = new Blob([resPdf], { type: 'application/pdf' })
          saveAs(blob, `${showReport?.nid}.pdf`)
        }
      }
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const handleShowDetailsModal = () => {
    setShowDetailsModal(true)
  }
  const handleDetailsClose = () => {
    setShowDetailsModal(false)
  }

  //*******************************Back button*************************************** */
  const onBack = () => {
    router.push({
      pathname: `/admin/onboarding/admin-report`,
    })
  }
  //*******************************Additional Files*************************************** */
  const showAdditionalFile = async () => {
    setArrowUp(!arrowUp)
    try {
      const resfile = await executeAdditionalfile({
        method: 'POST',
        url: postAdditionalFiles,
        data: { applicantId: applicantId },
      })
      setAdditionalFile(resfile?.data)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  const onBtnClick = async (index: number) => {
    try {
      const resfile = await executeAdditionalfile({
        method: 'POST',
        url: postAdditionalFiles,
        data: { applicantId: applicantId },
      })
      const fileData = resfile?.data.additionalFiles[index].data
      const fileType = resfile?.data.additionalFiles[index].fileType
      const fileName = resfile?.data.additionalFiles[index].fileName
      //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const blobFile = b64toBlob(fileData!, fileType)
      saveAs(blobFile, fileName)
    } catch (error) {
      toast.error('Unknown error')
    }
  }

  console.log('showReport?.riskGrading?.riskGradingData', showReport?.riskGrading?.riskGradingData)

  return (
    <>
      <div className="container my-33 mx-auto px-4 md:px-12 bg-white animate__animated animate__fadeIn">
        <div className="container m-auto mt-6 overflow-x-auto">
          <div className="flex flex-col w-full rounded-lg py-8 gap-y-3 ">
            <div className="">
              <label className="font-semibold">Personal Information</label>
              <div className=" border-b-2 m-auto border-indigo-700 "></div>
              <div className="  p-4">
                <Row>
                  <>
                    <TextRowFull label="EKYC ID" value={showReport?.id} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="NID No" value={showReport?.nid} />
                    <TextRow label="TIN No" value={showReport?.tin} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Name  " value={showReport?.name} />
                    <TextRow label="Name Bangla" value={showReport?.nameBangla} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Mobile No " value={showReport?.mobile} />
                    <DateRow label="Date Of Birth" value={showReport?.dob} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Father Name " value={showReport?.fatherName} />
                    <TextRow label="Father Name Bangla" value={showReport?.fatherNameBangla} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Mother Name" value={showReport?.motherName} />
                    <TextRow label="Mother Name Bangla" value={showReport?.motherNameBangla} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Spouse Name " value={showReport?.spouseName} />
                    <TextRow label="Nationality " value={showReport?.nationality} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Profession " value={showReport?.profession ?? ''} />
                    <TextRow label="Monthly Income  " value={showReport?.monthlyIncome} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Gender" value={getFullGender(showReport?.gender ?? '')} />
                    <TextRow label="Religion  " value={showReport?.religion} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow
                      label="Verification Status"
                      value={getFullVerificationStatus(showReport?.verificationStatus ?? '')}
                    />
                    <TextRow label="Email" value={showReport?.email} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Verification Type  " value={showReport?.verificationType} />
                    <DateRow label="Verification Date   " value={showReport?.verificationDate} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Onboarding Type" value={getFullEkycType(showReport?.onboardingType ?? '')} />
                    <TextRow label="Source Of Fund" value={showReport?.sourceOfFund} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Created By" value={showReport?.createdBy} />
                    <DateRow label="Create Date" value={showReport?.createDate} />
                  </>
                </Row>
                <Row>
                  <>
                    <TextRow label="Updated By" value={showReport?.updatedBy} />
                    <DateRow label="Update Date" value={showReport?.updateDate} />
                  </>
                </Row>
              </div>
              <div className=" p-4">
                <label className="font-semibold">Account Information</label>
                <div className=" border-b-2 m-auto border-indigo-700 "></div>
                <div className=" ">
                  <Row>
                    <>
                      <TextRowFull label="Account ID" value={showReport?.account.id} />
                    </>
                  </Row>
                  <Row>
                    <>
                      <TextRow label="Branch/Agent Point" value={showReport?.account.branchOrAgentPointCode} />
                      <TextRow label="Title " value={showReport?.account.title} />
                    </>
                  </Row>
                  <Row>
                    <>
                      <TextRow label=" Account Number " value={showReport?.account.channelAccountId} />
                      <TextRow label="Product Type " value={showReport?.account.productType} />
                    </>
                  </Row>
                  <Row>
                    <>
                      <TextRow
                        label="Channel Code "
                        value={getFullChanneltName(showReport?.account.channelCode ?? '')}
                      />
                      <TextRow label="Product Code" value={showReport?.account.productCode} />
                    </>
                  </Row>
                  <Row>
                    <>
                      <TextRow label="Status" value={getFullVerificationStatus(showReport?.account.status ?? '')} />
                      <TextRow label="Type" value={getFullAccountType(showReport?.account.type ?? '')} />
                    </>
                  </Row>
                  <Row>
                    <>
                      <TextRowFull
                        label="Transaction / Maturity Amount"
                        value={showReport?.account.transactionOrMaturityAmount}
                      />
                    </>
                  </Row>
                </div>
              </div>

              <div className="p-4">
                <label className="font-semibold">Nominee Information</label>
                <div className="mt-2 border-b-2 m-auto border-indigo-700"></div>
                <div>
                  {showReport?.nominees &&
                    showReport.nominees.map((n, i) => (
                      <div key={n.id}>
                        <Row>
                          <>
                            <TextRow label="Nominee" value={i + 1} />
                          </>
                        </Row>
                        <Row>
                          <>
                            <TextRow label="Name" value={n.name} />
                            <TextRow label="Nominee Relation" value={n.relation} />
                          </>
                        </Row>
                        <Row>
                          <>
                            <TextRow label="Percentage" value={n.percentage} />
                            <DateRow label="Date Of Birth" value={n.dob} />
                          </>
                        </Row>
                        <Row>
                          <>
                            <TextRow label="Father Name" value={n.fatherName} />
                            <TextRow label="Mother Name" value={n.motherName} />
                          </>
                        </Row>
                        <Row>
                          <>
                            <TextRow label="Document No" value={n.docNo} />
                            <TextRow label="Document Type" value={n.docType} />
                          </>
                        </Row>
                        <div className="flex flex-wrap -mx-2 mb-8 mt-2  border-4 border-gray-300 border-dashed bg-white rounded-md p-3">
                          <div className="w-full md:w-1/2 lg:w-1/2 px-2 mb-4 ">
                            <div className=" text-sm text-grey-dark flex items-center justify-center">
                              <img
                                className="w-60 h-40 rounded-md m-auto justify-center justify-items-center"
                                src={
                                  n?.docFrontImage ? flag + n?.docFrontImage : '/img/placeholder_nominee_photo@2x.png'
                                }
                                alt="profile Image"
                                title="nidBack"
                              />
                            </div>
                          </div>
                          <div className="w-full md:w-1/2 lg:w-1/2 px-2 mb-4">
                            <div className=" text-sm text-grey-dark flex items-center justify-center">
                              <img
                                className="w-60 h-40 rounded-md m-auto justify-center justify-items-center"
                                src={n?.docBackImage ? flag + n?.docBackImage : '/img/placeholder_nominee_photo@2x.png'}
                                alt="profile Image"
                                title="nidBack"
                              />
                            </div>
                          </div>
                        </div>
                        {n.isMinor && (
                          <div>
                            <div className="p-4">
                              <label className="  font-semibold">Guardian Information</label>
                              <div className=" border-b-2 m-auto border-indigo-700"></div>
                              <Row>
                                <>
                                  <TextRow label="Guardian NID" value={n.guardian.nid} />
                                  <TextRow label="Guardian Name" value={n.guardian.name} />
                                </>
                              </Row>
                              <Row>
                                <>
                                  <TextRow label="Guardian Address" value={n.guardian.address} />
                                  <TextRow label="Guardian Relation" value={n.guardian.relation} />
                                </>
                              </Row>
                            </div>
                            <div className="w-full mt-2 border-4 border-gray-300 border-dashed bg-white rounded-md ">
                              <div className=" p-4">
                                <div>
                                  <div className="font-normal text-gray-900 text-md text-center ">Guardian Image</div>
                                  <img
                                    className="w-60 h-40 rounded-md m-auto justify-center justify-items-center"
                                    src={
                                      n?.guardian.photo
                                        ? flag + n?.guardian.photo
                                        : '/img/placeholder_nominee_photo@2x.png'
                                    }
                                    alt="profile Image"
                                    title="nidBack"
                                  />
                                </div>
                                <div></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              <div className="   p-4">
                {showRisk && (
                  <div>
                    <label className="font-semibold">Risk Grading</label>
                    <div className="mt-2 border-b-2 m-auto border-indigo-700 "></div>
                    <Row>
                      <>
                        <TextRow label="Overall Score" value={showReport?.riskGrading?.score} />
                        <TextRow label="Risk Type" value={measureRisk(showReport?.riskGrading?.score ?? 0)} />
                      </>
                    </Row>
                    <div className="p-4 flex justify-center items-center w-full">
                      <InlineButton
                        // disabled={isUserList}
                        icon={<FaGripfire />}
                        value="Risk Grading Details"
                        onClick={handleShowDetailsModal}
                        color="bg-green-400 hover:bg-green-500"
                        width="w-40"
                      />
                    </div>
                  </div>
                )}

                <div className=" mt-2 p-4">
                  <label className="font-semibold">Permanent Address Details</label>
                  <div className="mt-2 border-b-2 m-auto border-indigo-700 "></div>
                  <div className="mt-4 block max-w-full p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <p className="font-normal text-gray-700 ">
                      <Row>
                        <>
                          <TextRow label="Division " value={showReport?.permanentAddress.division} />
                          <TextRow label="Region " value={showReport?.permanentAddress.region} />
                        </>
                      </Row>
                      <Row>
                        <>
                          <TextRow label="District" value={showReport?.permanentAddress.district} />
                          <TextRow label="District Code" value={showReport?.permanentAddress.districtCode} />
                        </>
                      </Row>

                      <Row>
                        <>
                          <TextRow label="Upozila  " value={showReport?.permanentAddress.upozila} />
                          <TextRow label="Upozila Code" value={showReport?.permanentAddress.upozilaCode} />
                        </>
                      </Row>
                      <Row>
                        <>
                          <TextRow label="Union Or Ward" value={showReport?.permanentAddress.unionOrWardEng} />
                          <TextRow label="Union Or Ward Code " value={showReport?.permanentAddress.unionOrWard} />
                        </>
                      </Row>
                      <Row>
                        <>
                          <TextRow
                            label="Mouza Or Moholla"
                            value={showReport?.permanentAddress.additionalMouzaOrMoholla}
                          />
                          <TextRow
                            label="Village Or Road"
                            value={showReport?.permanentAddress.additionalVillageOrRoad}
                          />
                        </>
                      </Row>
                      <Row>
                        <>
                          <TextRow label="City" value={showReport?.permanentAddress.cityCorporationOrMunicipality} />
                          <TextRow label="Home Or Holding No." value={showReport?.permanentAddress.homeOrHoldingNo} />
                        </>
                      </Row>
                      <Row>
                        <>
                          <TextRow label="Post Office" value={showReport?.permanentAddress.postOffice} />
                          <TextRow label="Postal Code" value={showReport?.permanentAddress.postalCode} />
                        </>
                      </Row>

                      <Row>
                        <>
                          <TextRow label="RMO " value={showReport?.permanentAddress.rmo} />
                          <TextRow
                            label="Ward For Union Porishod"
                            value={showReport?.permanentAddress.wardForUnionPorishod}
                          />
                        </>
                      </Row>
                    </p>
                  </div>
                </div>

                <div className=" mt-2 p-4">
                  <label className="font-semibold">Present Address Details</label>
                  <div className="mt-2 border-b-2 m-auto border-indigo-700 "></div>
                  <div className="mt-4 block max-w-full p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <p className="font-normal text-gray-700 ">
                      <Row>
                        <>
                          <TextRow label="Division " value={showReport?.presentAddress.district} />
                          <TextRow label="Region " value={showReport?.presentAddress.region} />
                        </>
                      </Row>
                      <Row>
                        <>
                          <TextRow label="District" value={showReport?.presentAddress.district} />
                          <TextRow label="District Code" value={showReport?.presentAddress.districtCode} />
                        </>
                      </Row>

                      <Row>
                        <>
                          <TextRow label="Upozila  " value={showReport?.presentAddress.upozila} />
                          <TextRow label="Upozila Code" value={showReport?.presentAddress.upozilaCode} />
                        </>
                      </Row>
                      <Row>
                        <>
                          <TextRow label="Union Or Ward" value={showReport?.presentAddress.unionOrWardEng} />
                          <TextRow label="Union Or Ward Code " value={showReport?.presentAddress.unionOrWard} />
                        </>
                      </Row>
                      <Row>
                        <>
                          <TextRow
                            label="Mouza Or Moholla"
                            value={showReport?.presentAddress.additionalMouzaOrMoholla}
                          />
                          <TextRow label="Village Or Road" value={showReport?.presentAddress.additionalVillageOrRoad} />
                        </>
                      </Row>
                      <Row>
                        <>
                          <TextRow label="City" value={showReport?.presentAddress.cityCorporationOrMunicipality} />
                          <TextRow label="Home Or Holding No." value={showReport?.presentAddress.homeOrHoldingNo} />
                        </>
                      </Row>
                      <Row>
                        <>
                          <TextRow label="Post Office" value={showReport?.presentAddress.postOffice} />
                          <TextRow label="Postal Code" value={showReport?.presentAddress.postalCode} />
                        </>
                      </Row>

                      <Row>
                        <>
                          <TextRow label="RMO " value={showReport?.presentAddress.rmo} />
                          <TextRow
                            label="Ward For Union Porishod"
                            value={showReport?.presentAddress.wardForUnionPorishod}
                          />
                        </>
                      </Row>
                    </p>
                  </div>
                </div>
              </div>
              <div className="   p-4">
                <label className="font-semibold">Other Information</label>
                <div className="mt-2 border-b-2 m-auto border-indigo-700 "></div>
                <Row>
                  <>
                    <TextRow label="Pin " value={showReport?.pin} />
                    <TextRow label="Review Count" value={showReport?.reviewCount} />
                  </>
                </Row>
              </div>
              {showRisk && (
                <div className="p-4 border-t-2 border-indigo-500 ">
                  <button className="w-full" onClick={showAdditionalFile}>
                    <span className="p-4 flex justify-center gap-3 items-center font-semibold border-2 border-dashed border-gray-300">
                      Additional File{' '}
                      {arrowUp ? (
                        <FaArrowAltCircleUp className=" text-indigo-500" />
                      ) : (
                        <FaArrowAltCircleDown className=" text-indigo-500" />
                      )}
                    </span>
                  </button>
                  {arrowUp ? (
                    <div className="grid md:grid-cols-3 gap-3 sm:grid-cols-1 p-4 rounded w-full px-6 py-3  ">
                      {additionalFile &&
                        additionalFile.additionalFiles.map((file, i) => (
                          <p
                            key={file.id}
                            onClick={() => onBtnClick(i)}
                            className="  block w-full whitespace-nowrap bg-transparent px-4 py-2 text-md   hover:bg-neutral-100 active:text-neutral-900 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 cursor-pointer "
                          >
                            <span className="flex justify-center items-center gap-3 hover:duration-200 uppercase">
                              {file.type}
                              <FaDownload className=" text-indigo-500" />
                            </span>
                          </p>
                        ))}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              )}
              <div className=" p-4  ">
                <label className="font-semibold">Document Info</label>
                <div className="mt-1 border-b-2 m-auto border-indigo-700  "></div>
                <div className="w-full mt-2 border-4 border-gray-300 border-dashed bg-white rounded-md ">
                  <div className="grid md:grid-cols-3 gap-3 sm:grid-cols-1 p-4">
                    <div>
                      <div className="font-normal text-gray-900 text-md text-center ">NID Front</div>
                      <img
                        className="w-60 h-40 rounded-md m-auto"
                        src={
                          profileShow?.nidFront ? flag + profileShow?.nidFront : '/img/placeholder_nominee_photo@2x.png'
                        }
                        alt="profile Image"
                        title="nidBack"
                      />
                    </div>
                    <div>
                      <div className="font-normal text-gray-700 text-md  text-center ">NID Back</div>
                      <img
                        className="w-60 h-40 rounded-md m-auto"
                        src={
                          profileShow?.nidBack ? flag + profileShow?.nidBack : '/img/placeholder_nominee_photo@2x.png'
                        }
                        alt="nidBack"
                      />
                    </div>
                    <div>
                      <div className="font-normal text-gray-700 text-md  text-center ">Photo</div>
                      <img
                        className="w-60 h-40 rounded-md m-auto"
                        src={profileShow?.photo ? flag + profileShow?.photo : '/img/placeholder_nominee_photo@2x.png'}
                        alt="profile Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <label className="font-semibold">Nominee Image</label>
                <div className="mt-1 border-b-2 m-auto border-indigo-700  "></div>
                <div className="w-full mt-2 border-4 border-gray-300 border-dashed bg-white rounded-md ">
                  <div className="grid md:grid-cols-3 gap-3 sm:grid-cols-1  p-4">
                    {showReport?.nominees &&
                      showReport.nominees.map((n, i) => (
                        <div className="" key={n.id}>
                          <div className="font-normal text-gray-700 text-md text-center ">Nominee {i + 1} Photo</div>
                          <img
                            className="w-60 h-40 rounded-md m-auto"
                            src={n?.photo ? flag + n?.photo : '/img/placeholder_nominee_photo@2x.png'}
                            alt="profile Image"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {isReportLoading ? (
                <div className="flex justify-center">
                  <Spinner color="purple" aria-label="Loading" size="xl" />
                </div>
              ) : (
                ''
              )}
              <div className="flex flex-wrap md:grid-cols-5 justify-center  gap-1 sm:grid-cols-1  p-2">
                <ButtonCom
                  width="w-40"
                  id="submit"
                  label="Download"
                  onClick={onDownloadFile}
                  disable={isReportLoading}
                />
                <ButtonCom width="w-40" id="Back" label="Back" onClick={onBack} />
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={showDetailsModal}
          size="6xl"
          onClose={handleDetailsClose}
          popup={true}
          position="top-center"
          dismissible={false}
        >
          <Modal.Header className="bg-slate-100">
            <p className="ml-3 my-2">Risk Details</p>
          </Modal.Header>
          <Modal.Body className=" bg-slate-100">
            {showReport?.riskGrading && (
              <RiskGradingReport riskValue={showReport?.riskGrading?.riskGradingData ?? []} />
            )}
          </Modal.Body>
          <Modal.Footer className="flex justify-end bg-slate-100">
            <Button color="gray" onClick={handleDetailsClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}
