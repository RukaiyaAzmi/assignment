import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface NidVerificationState {
  step: number
  verificationToken: string
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
  fingerprint: {
    rThumb: string
    rIndex: string
    lThumb: string
    lIndex: string
  }
}

const initState: NidVerificationState = {
  step: 1,
  verificationToken: '',
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
  fingerprint: {
    rThumb: '',
    rIndex: '',
    lThumb: '',
    lIndex: '',
  },
}

const verificationSlice = createSlice({
  name: 'nid-verification',
  initialState: initState,
  reducers: {
    setApplicant: (state, action: PayloadAction<{ name: string; value: string }>) => {
      const { name, value } = action.payload
      state.applicant[name] = value
    },
    increment: (state) => {
      state.step = state.step + 1
    },
    setApplicatFile: (state, action: PayloadAction<{ name: string; value: string }>) => {
      const { name, value } = action.payload
      state.applicantFile[name] = value
    },
    setFingerprint: (
      state,
      action: PayloadAction<{ rightThumb: string; rightIndex: string; leftThumb: string; leftIndex: string }>,
    ) => {
      const { rightIndex, rightThumb, leftIndex, leftThumb } = action.payload
      //eslint-disable-next-line
      ;(state.fingerprint!.lIndex = leftIndex),
        //eslint-disable-next-line
        (state.fingerprint!.lThumb = leftThumb),
        //eslint-disable-next-line
        (state.fingerprint!.rIndex = rightIndex),
        //eslint-disable-next-line
        (state.fingerprint!.rThumb = rightThumb)
    },
    setECFingerApiData: (state, action) => {
      const permanentWard = action.payload.permanentAddress.wardForUnionPorishod
      const presentWard = action.payload.presentAddress.wardForUnionPorishod
      if (permanentWard !== undefined) action.payload.permanentAddress.wardForUnionPorishod = permanentWard.toString()
      if (presentWard !== undefined) action.payload.presentAddress.wardForUnionPorishod = presentWard.toString()

      state.applicant.nameBangla = action.payload.name
      state.applicant.name = action.payload.nameEn
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
      state.applicant.motherNameBangla = action.payload.motherName
      state.applicant.fatherNameBangla = action.payload.fatherName
      state.applicant.spouseName = action.payload.spouseName
      state.applicant.pin = action.payload.pin
      state.applicantFile.nidFrontImage = action.payload.image
      state.applicantPermanentAddress = { ...state.applicantPermanentAddress, ...action.payload.permanentAddress }
      state.applicantPresentAddress = { ...state.applicantPresentAddress, ...action.payload.presentAddress }
    },
    resetNidVerificationState: () => {
      return {
        ...initState,
      }
    },
  },
})

export const {
  setApplicant,
  increment,
  setECFaceApiData,
  setECFingerApiData,
  setFingerprint,
  resetNidVerificationState,
  setApplicatFile,
} = verificationSlice.actions

export default verificationSlice.reducer
