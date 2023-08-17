import { CHANNEL } from '@interfaces/channel.interface'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const TOTAL_ONBOARDING_STEP = 12
export interface IActionState {
  name: string
  value: string
}

export interface ApplicantState {
  name: string
  value: string
}
export interface EKYCState {
  step: number
  ekycType: string
  stepType: 'I' | 'D'
  stepWeight: number
  tempStorageId: string
  verificationToken: string
  account: {
    title: string
    type: string
    productType: string
    productCode: string
    productCategoryCode: string
    branchOrAgentPointCode: string
    transactionOrMaturityAmount: number
    tenor?: string
    channelCode: CHANNEL
  }
  applicant: {
    nid: string
    tin?: string
    name: string
    nameBangla: string
    dob: string
    dobDate: string
    motherName: string
    motherNameBangla: string
    fatherName: string
    fatherNameBangla: string
    spouseName?: string
    gender: string
    profession: string
    mobile: string
    email?: string
    pin?: string
    religion?: string
    verificationType: string
    onboardingType?: string
  }
  applicantPresentAddress: {
    addressType: string
    divisionCode: string
    districtCode: string
    upozilaCode: string
    unionCode: string
    additionalMouzaOrMoholla?: string
    additionalVillageOrRoad?: string
    cityCorporationOrMunicipality?: string
    district: string
    division?: string
    homeOrHoldingNo?: string
    postOffice?: string
    region?: string
    unionOrWard: string
    upozila: string
    postalCode?: string
    rmo?: string
    wardForUnionPorishod?: string
    additionalMouzaOrMohollaEng?: string
    additionalVillageOrRoadEng?: string
    cityCorporationOrMunicipalityEng?: string
    districtEng: string
    divisionEng?: string
    homeOrHoldingNoEng?: string
    postOfficeEng?: string
    regionEng?: string
    unionOrWardEng: string
    upozilaEng: string
  }
  applicantPermanentAddress: {
    addressType: string
    divisionCode: string
    districtCode: string
    upozilaCode: string
    unionCode: string
    additionalMouzaOrMoholla?: string
    additionalVillageOrRoad?: string
    cityCorporationOrMunicipality?: string
    district: string
    division?: string
    homeOrHoldingNo?: string
    postOffice?: string
    region?: string
    unionOrWard: string
    upozila: string
    postalCode?: string
    rmo?: string
    wardForUnionPorishod?: string
    additionalMouzaOrMohollaEng?: string
    additionalVillageOrRoadEng?: string
    cityCorporationOrMunicipalityEng?: string
    districtEng: string
    divisionEng?: string
    homeOrHoldingNoEng?: string
    postOfficeEng?: string
    regionEng?: string
    unionOrWardEng: string
    upozilaEng: string
  }
  applicantFile: {
    nidFront: string
    nidBack: string
    photo: string
    signature: string
    nidFrontImage: string
  }
  nominees: {
    name: string
    relation: string
    dob: string
    photo: string
    isMinor: boolean
    percentage: number
    fatherName?: string
    motherName?: string
    docType?: string
    docNo?: string
    docFrontImage?: string
    docBackImage?: string
    guardian?: {
      nid: string
      name: string
      relation: string
      address: string
      photo: string
    }
  }[]
  regularAdditionalData: {
    monthlyIncome: number
    sourceOfFund: string
    nationality: string
    tinNumber?: string
    riskInfo: string[]
    fatca: {
      data: string
      fileName: string
      fileType: string
    }
    aml: {
      data: string
      fileName: string
      fileType: string
    }
    edd: {
      data: string
      fileName: string
      fileType: string
    }
  }
  fingerprint?: {
    rIndex: string
    rThumb: string
    lThumb: string
    lIndex: string
  }
}

const initState: EKYCState = {
  step: 1,
  ekycType: '',
  stepType: 'I',
  stepWeight: 100 / TOTAL_ONBOARDING_STEP,
  tempStorageId: '',
  verificationToken: '',
  account: {
    title: '',
    type: 'S',
    productType: 'CONVENTIONAL',
    productCode: '',
    productCategoryCode: '',
    branchOrAgentPointCode: '',
    transactionOrMaturityAmount: 0,
    tenor: '',
    channelCode: CHANNEL.ABS,
  },
  applicant: {
    nid: '',
    tin: '',
    name: '',
    nameBangla: '',
    dob: '',
    dobDate: '',
    motherName: '',
    motherNameBangla: '',
    fatherName: '',
    fatherNameBangla: '',
    spouseName: '',
    gender: '',
    profession: '',
    mobile: '',
    email: '',
    pin: '',
    religion: '',
    verificationType: '',
    onboardingType: '',
  },
  applicantPresentAddress: {
    addressType: 'PRESENT',
    //it's not sync with account create
    divisionCode: '',
    districtCode: '',
    upozilaCode: '',
    unionCode: '',
    additionalMouzaOrMoholla: '',
    additionalVillageOrRoad: '',
    cityCorporationOrMunicipality: '',
    district: '',
    division: '',
    homeOrHoldingNo: '',
    postOffice: '',
    region: '',
    unionOrWard: '',
    upozila: '',
    postalCode: '',
    rmo: '',
    wardForUnionPorishod: '',
    additionalMouzaOrMohollaEng: '',
    additionalVillageOrRoadEng: '',
    cityCorporationOrMunicipalityEng: '',
    districtEng: '',
    divisionEng: '',
    homeOrHoldingNoEng: '',
    postOfficeEng: '',
    regionEng: '',
    unionOrWardEng: '',
    upozilaEng: '',
  },
  applicantPermanentAddress: {
    addressType: 'PERMANENT',
    //it's not sync with account create
    divisionCode: '',
    districtCode: '',
    upozilaCode: '',
    unionCode: '',
    additionalMouzaOrMoholla: '',
    additionalVillageOrRoad: '',
    cityCorporationOrMunicipality: '',
    district: '',
    division: '',
    homeOrHoldingNo: '',
    postOffice: '',
    region: '',
    unionOrWard: '',
    upozila: '',
    postalCode: '',
    rmo: '',
    wardForUnionPorishod: '',
    additionalMouzaOrMohollaEng: '',
    additionalVillageOrRoadEng: '',
    cityCorporationOrMunicipalityEng: '',
    districtEng: '',
    divisionEng: '',
    homeOrHoldingNoEng: '',
    postOfficeEng: '',
    regionEng: '',
    unionOrWardEng: '',
    upozilaEng: '',
  },
  applicantFile: {
    nidFront: '',
    nidBack: '',
    photo: '',
    signature: '',
    nidFrontImage: '',
  },
  nominees: [],
  regularAdditionalData: {
    monthlyIncome: 0,
    sourceOfFund: '',
    nationality: 'Bangladeshi',
    tinNumber: '',
    riskInfo: [],
    fatca: {
      data: '',
      fileName: '',
      fileType: '',
    },
    aml: {
      data: '',
      fileName: '',
      fileType: '',
    },
    edd: {
      data: '',
      fileName: '',
      fileType: '',
    },
  },
  fingerprint: {
    rThumb: '',
    rIndex: '',
    lThumb: '',
    lIndex: '',
  },
}

const ekycSlice = createSlice({
  name: 'ekyc',
  initialState: initState,
  reducers: {
    increment: (state) => {
      state.step = state.step + 1
      state.stepType = 'I'
    },
    decrement: (state) => {
      state.step = state.step - 1
      state.stepType = 'D'
    },
    setAccount: (state, action: PayloadAction<IActionState>) => {
      const { name, value } = action.payload
      state.account[name] = value
    },
    setProductCodeEmpty: (state) => {
      state.account.productCode = ''
    },
    setAccountTitle: (state, action: PayloadAction<string>) => {
      state.account.title = action.payload
    },
    setBranchCode: (state, action) => {
      state.account.branchOrAgentPointCode = action.payload
    },
    setApplicant: (state, action: PayloadAction<IActionState>) => {
      const { name, value } = action.payload
      state.applicant[name] = value
    },
    setNidOcr: (state, action: PayloadAction<{ nid: string; dob: string; dobDate: string }>) => {
      const { nid, dob, dobDate } = action.payload
      state.applicant.nid = nid
      state.applicant.dob = dob
      state.applicant.dobDate = dobDate
    },
    setTempData: (state, action) => {
      return { ...state, ...action.payload }
    },
    setApplicatFile: (state, action: PayloadAction<IActionState>) => {
      const { name, value } = action.payload
      state.applicantFile[name] = value
    },
    setAdditionalFile: (state, action) => {
      const { name, type, value } = action.payload
      state.regularAdditionalData[name].data = value
      state.regularAdditionalData[name].fileType = type
      state.regularAdditionalData[name].fileName = name
    },
    addNominee: (state, action: PayloadAction<'M' | 'A'>) => {
      switch (action.payload) {
        case 'M':
          state.nominees.push({
            name: '',
            relation: '',
            dob: '',
            photo: '',
            isMinor: true,
            percentage: 0,
            fatherName: '',
            motherName: '',
            docType: '',
            docNo: '',
            docFrontImage: '',
            docBackImage: '',
            guardian: {
              nid: '',
              name: '',
              relation: '',
              address: '',
              photo: '',
            },
          })
          break
        case 'A':
          state.nominees.push({
            name: '',
            relation: '',
            dob: '',
            photo: '',
            isMinor: false,
            percentage: 0,
            fatherName: '',
            motherName: '',
            docType: '',
            docNo: '',
            docFrontImage: '',
            docBackImage: '',
          })
          break
      }
    },
    setPermanentAddress: (state, action: PayloadAction<ApplicantState>) => {
      const { name, value } = action.payload
      state.applicantPermanentAddress[name] = value
    },
    setVerificationToken: (state, action: PayloadAction<string>) => {
      state.verificationToken = action.payload
    },
    setPresentAddress: (state, action: PayloadAction<ApplicantState>) => {
      const { name, value } = action.payload
      state.applicantPresentAddress[name] = value
    },
    setAdditionalData: (state, action: PayloadAction<ApplicantState>) => {
      const { name, value } = action.payload
      state.regularAdditionalData ? (state.regularAdditionalData[name] = value) : ''
    },
    setECFingerApiData: (state, action) => {
      const permanentWard = action.payload.permanentAddress.wardForUnionPorishod
      const presentWard = action.payload.presentAddress.wardForUnionPorishod
      if (permanentWard !== undefined) action.payload.permanentAddress.wardForUnionPorishod = permanentWard.toString()
      if (presentWard !== undefined) action.payload.presentAddress.wardForUnionPorishod = presentWard.toString()

      state.applicant.nameBangla = action.payload.name
      state.applicant.name = action.payload.nameEn
      state.account.title = action.payload.nameEn
      state.applicant.motherNameBangla = action.payload.mother
      state.applicant.fatherNameBangla = action.payload.father
      state.applicant.spouseName = action.payload.spouse
      state.applicant.pin = action.payload.pin
      state.applicantFile.nidFrontImage = action.payload.photo
      state.applicantPermanentAddress = { ...state.applicantPermanentAddress, ...action.payload.permanentAddress }
      state.applicantPresentAddress = { ...state.applicantPresentAddress, ...action.payload.presentAddress }
    },
    setECFaceApiData: (state, action) => {
      const permanentWard = action.payload.permanentAddress.wardForUnionPorishod
      const presentWard = action.payload.presentAddress.wardForUnionPorishod
      if (permanentWard) action.payload.permanentAddress.wardForUnionPorishod = permanentWard.toString()
      if (presentWard) action.payload.presentAddress.wardForUnionPorishod = presentWard.toString()

      state.applicant.nameBangla = action.payload.nameBan
      state.applicant.name = action.payload.nameEng
      state.account.title = action.payload.nameEng
      state.applicant.motherNameBangla = action.payload.motherName
      state.applicant.fatherNameBangla = action.payload.fatherName
      state.applicant.spouseName = action.payload.spouseName
      state.applicant.pin = action.payload.pin
      state.applicantFile.nidFrontImage = action.payload.image
      state.applicantPermanentAddress = { ...state.applicantPermanentAddress, ...action.payload.permanentAddress }
      state.applicantPresentAddress = { ...state.applicantPresentAddress, ...action.payload.presentAddress }
    },
    setRiskInfo: (state, action) => {
      const { index, value } = action.payload
      state.regularAdditionalData.riskInfo.splice(index, 1, value)
    },
    // set nominee information
    setNominee: (state, action: PayloadAction<{ index: number; name: string; value: string | number | boolean }>) => {
      const { index, name, value } = action.payload
      state.nominees[index][name] = value
    },
    // set nominee guardian information for minor nominee
    setNomineeGuardian: (
      state,
      action: PayloadAction<{ index: number; name: string; value: string | number | boolean }>,
    ) => {
      const { index, name, value } = action.payload
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.nominees[index]['guardian']![name] = value
    },
    removeNominee: (state, action: PayloadAction<number>) => {
      state.nominees.splice(action.payload, 1)
    },
    setTempId: (state, action) => {
      state.tempStorageId = action.payload
    },
    setChannel: (state, action) => {
      state.account.channelCode = action.payload
    },
    setEkycType: (state, action) => {
      state.ekycType = action.payload
    },
    setFingerprint: (
      state,
      action: PayloadAction<{ rightThumb: string; rightIndex: string; leftThumb: string; leftIndex: string }>,
    ) => {
      const { rightIndex, rightThumb, leftIndex, leftThumb } = action.payload
      //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.fingerprint!.lIndex = leftIndex
      //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.fingerprint!.lThumb = leftThumb
      //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.fingerprint!.rIndex = rightIndex
      //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.fingerprint!.rThumb = rightThumb
    },

    // reset the store to Initial state
    resetOnboardingState: () => {
      return {
        ...initState,
      }
    },
  },
})

export const {
  increment,
  decrement,
  setBranchCode,
  setApplicant,
  setNidOcr,
  setAdditionalData,
  setPermanentAddress,
  setVerificationToken,
  setPresentAddress,
  setApplicatFile,
  setECFingerApiData,
  setECFaceApiData,
  addNominee,
  setAccount,
  setProductCodeEmpty,
  setAccountTitle,
  setTempData,
  setRiskInfo,
  setNominee,
  setNomineeGuardian,
  removeNominee,
  setTempId,
  setEkycType,
  setAdditionalFile,
  setChannel,
  setFingerprint,
  resetOnboardingState,
} = ekycSlice.actions

export default ekycSlice.reducer
