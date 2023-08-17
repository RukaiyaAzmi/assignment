export function getFullUserStatus(status: string) {
  if (status === 'A') return 'Active'
  else if (status === 'I') return 'Inactive'
  else if (status === 'P') return 'Pending'
  else if (status === 'R') return 'Rejected'
  else if (status === 'D') return 'Deleted'
  else return ''
}
export function getFullCategoryName(CategoryName: string) {
  if (CategoryName === 'S0') return 'Savings Account'
  else if (CategoryName === 'C0') return 'Current Account'
  else if (CategoryName === 'TD') return 'Term Deposit'
  else if (CategoryName === 'RD') return 'Recurring Deposit'
  else return ''
}

export function getFullChanneltName(channelName: string) {
  if (channelName === 'ABS') return 'Agent Banking'
  else if (channelName === 'CBS') return 'Conventional Core Banking'
  else if (channelName === 'ICBS') return 'Islamic Core Banking'
  else if (channelName === 'EKYC') return 'EKYC'
  else return ''
}

export function getFullGender(gender: string) {
  if (gender === 'M') return 'Male'
  else if (gender === 'F') return 'Female'
  else if (gender === 'T') return 'Others'
  else return ''
}

export function getFullAccountType(accountType: string) {
  if (accountType === 'S') return 'Single'
  else if (accountType === 'J') return 'Joint'
  else return ''
}

export function getFullVerificationStatus(verifyStatus: string) {
  if (verifyStatus === 'V') return 'Verified'
  else if (verifyStatus === 'N') return 'Not Verified'
  else if (verifyStatus === 'P') return 'Pending'
  else return ''
}
