export const baseURL = process.env.NEXT_PUBLIC_API_URL
export const ecURL = process.env.NEXT_PUBLIC_EC_API_URL
const isDummyActive: boolean = JSON.parse(process.env.NEXT_PUBLIC_ISDUMMY ?? 'false')

/**
 * User Management
 */
export const postUserLogin = `${baseURL}/user/login`
export const postUserGet = `${baseURL}/user/get/1`
export const postUserLogout = `${baseURL}/user/logout`
export const postUserReport = `${baseURL}/user/get`
export const putUserApprove = `${baseURL}/user/status/`
export const postUserCreate = `${baseURL}/user`
export const postUserValidationCheck = `${baseURL}/user/check`
export const postUserGetAll = `${baseURL}/user/get/1`
export const putUserUpdate = `${baseURL}/user/`
export const getUserImage = `${baseURL}/user/get/image`
export const postForgetPassword = `${baseURL}/user/forget-password`
export const postForgetPasswordVerify = `${baseURL}/user/forget-password/verify`
export const postForgetPasswordConfirm = `${baseURL}/user/forget-password/confirm`
export const postVerifyLogin = `${baseURL}/user/2fa`

/**
 * Role Management
 */
export const postRoleReport = `${baseURL}/role/get/`
export const putRoleUpdate = `${baseURL}/role`
export const putRoleDelete = `${baseURL}/role/status/`
export const postCreateRole = `${baseURL}/role/`
export const postRoleGet = `${baseURL}/role/get/`
export const putRoleApprove = `${baseURL}/role/status/`

/*
 * profile
 */

export const getUserProfile = `${baseURL}/profile/`
export const putProfileUpdate = `${baseURL}/profile/`
export const putProfilePictureUpdate = `${baseURL}/profile/picture`
export const putPasswordUpdate = `${baseURL}/profile/change-password`

/*
 * tp Settings
 */

export const postTPCreate = `${baseURL}/tp/`

/*
 * app setting
 */

export const postSetting = `${baseURL}/setting/get`
export const putSetting = `${baseURL}/setting/`
export const postInitSetting = `${baseURL}/setting/init`

/*
 * product
 */
export const postProductCreate = `${baseURL}/product`
export const postProductList = `${baseURL}/product/get`
export const deleteProductList = `${baseURL}/product`
export const putProduct = `${baseURL}/product`

/*
 * Analytics
 */
export const getAccessLog = `${baseURL}/report/access-log`
export const postEkycCount = `${baseURL}/report/ekyc/count`
export const getReportCount = `${baseURL}/report/count`
export const postChartValue = `${baseURL}/report/ekyc/count/by/month`
export const postVerificationValue = `${baseURL}/report/verification/count/by/day`

export const postChannelWiseEkycCountWithFilter = `${baseURL}/report/channel-ekyc/count`
export const postChannelWiseCountReport = `${baseURL}/report/count/channel`
export const postChannelWiseEkycByMonth = `${baseURL}/report/channel-ekyc/count/by/month`
export const postChannelWiseVerificationByDay = `${baseURL}/report/channel-verification/count/by/day`

/*
 * TP
 */
export const postTpList = `${baseURL}/tp/get`
export const deleteTpList = `${baseURL}/tp`

export const updateTpList = `${baseURL}/tp`

/**
 * Integration
 */
export const getAgentPointList = baseURL + (isDummyActive ? '/dummy/abs/agentpoints' : '/integration/abs/agentpoints')
export const getBranchList = baseURL + (isDummyActive ? '/dummy/cbs/branch' : '/integration/cbs/branch')

/**
 * eKYC Onboarding
 */

export const postABSAccouontCheck =
  baseURL + (isDummyActive ? '/dummy/abs/account-check' : '/integration/abs/account-check')
export const postCBSAccountCheck =
  baseURL + (isDummyActive ? '/dummy/cbs/account-check' : '/integration/cbs/account-check')
export const postFingerprintVerification =
  baseURL + (isDummyActive ? '/dummy/fingerprint-verification' : '/integration/fingerprint-verification')

export const postFaceVerification = baseURL + (isDummyActive ? '/dummy/face-verification' : '/ai/face-verification')
export const postNidRpa = baseURL + (isDummyActive ? '/dummy/nid-rpa' : '/ai/nid-rpa')
export const postNidOcr = `${baseURL}/ai/nid-ocr`

//ABS URL
export const getABSDivision = baseURL + (isDummyActive ? '/dummy/abs/division' : '/address/get/abs/division')
export const postABSDistrict = baseURL + (isDummyActive ? '/dummy/abs/district' : '/address/get/abs/district')
export const postABSUpazila = baseURL + (isDummyActive ? '/dummy/abs/upazila' : '/address/get/abs/upazila')
export const postABSUnionOrWard = baseURL + (isDummyActive ? '/dummy/abs/union' : '/address/get/abs/union')
export const postABSProfession = baseURL + (isDummyActive ? '/dummy/get/profession' : '/address/get/profession')

//CBS URL
export const getCBSDivision = baseURL + (isDummyActive ? '/dummy/cbs/division' : '/integration/cbs/division')
export const postCBSDistrict = baseURL + (isDummyActive ? '/dummy/cbs/district' : '/integration/cbs/district')
export const postCBSUpazila = baseURL + (isDummyActive ? '/dummy/cbs/upazila' : '/integration/cbs/upazila')
export const postCBSUnion = baseURL + (isDummyActive ? '/dummy/cbs/union' : '/integration/cbs/union')
export const getCBSProfession = baseURL + (isDummyActive ? '/dummy/cbs/occupation' : '/integration/cbs/occupation')
export const getCBSRelation = baseURL + (isDummyActive ? '/dummy/cbs/relation' : '/integration/cbs/relation')

export const postSendOtp = `${baseURL}/conval/mobile/send-otp`
export const postVerifydOtp = `${baseURL}/conval/mobile/verify`
export const postProductGet = `${baseURL}/product/get/search`
export const getTemp = `${baseURL}/temp`
export const putEkycTemp = `${baseURL}/temp`
export const postEkycTypeGet = `${baseURL}/tp/ekyc-type`

export const postSimplifiedEkyc = baseURL + (isDummyActive ? '/dummy/ekyc/simplified' : '/ekyc/simplified')
export const postRegularEkyc = baseURL + (isDummyActive ? '/dummy/ekyc/regular' : '/ekyc/regular')
export const postAdminReport = `${baseURL}/ekyc/get`
export const postUpgradeToRegular = `${baseURL}/ekyc/regular/simplified-to-regular`
export const postAdminReportDetails = `${baseURL}/ekyc/user/get`
export const postAdditionalFiles = `${baseURL}/ekyc/regular/get/additional-files`

/**
 * NID Verification
 */
export const postNidFingerprintVerification =
  baseURL +
  (isDummyActive ? '/dummy/nid-verification/fingerprint-verification' : '/nid-verification/fingerprint-verification')

export const postNidFaceVerification =
  baseURL + (isDummyActive ? '/dummy/nid-verification/face-verification' : '/nid-verification/face-verification')

/**
 * Full profile
 */
export const postFullProfile = `${baseURL}/ekyc/full/get`
export const postFullProfileDownload = `${baseURL}/report/ekyc/simplified/pdf`
export const postFullProfileDownloadReg = `${baseURL}/report/ekyc/regular/pdf`
export const postAllEkycGet = `${baseURL}/ekyc/simplified/get`
export const postEkycFullGet = `${baseURL}/ekyc/full/get`

/**
 * Account
 */

export const postAccountGet = `${baseURL}/account/get`
export const postAccountReopen = `${baseURL}/account/reopen`
export const postAccountDiscard = `${baseURL}/account/discard`
export const postChannelGet = `${baseURL}/account/applicant/get`

/**
 * NID
 */

export const postNidVerificationList = `${baseURL}/nid-verification/get`
export const postVerificationDepository = `${baseURL}/depository/get`
