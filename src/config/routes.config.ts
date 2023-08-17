export const routes = [
  /**
   * Role Module
   */
  {
    title: 'Role',
    code: '1',
    icon: '/icon/icon_role.svg',
    showable: true,
    children: [
      { title: 'Create', code: '1.1', icon: '/icon/icon_create.svg', showable: true, url: '/admin/role/create' },
      { title: 'Approval', code: '1.2', icon: '/icon/icon_role.svg', showable: true, url: '/admin/role/approve' },
      { title: 'Update', code: '1.3', icon: '/icon/icon_update.svg', showable: false, url: '/admin/role/update' },
      { title: 'Reports', code: '1.5', icon: '/icon/icon_list.svg', showable: true, url: '/admin/role/report' },
      { title: 'Delete', code: '1.6', icon: '/icon/icon_delete.svg', showable: false, url: '/admin/role/delete' },
    ],
  },
  /**
   * User Module
   */
  {
    title: 'User',
    code: '2',
    icon: '/icon/icon_user.svg',
    showable: true,
    children: [
      { title: 'Create', code: '2.1', icon: '/icon/icon_create.svg', showable: true, url: '/admin/user/create' },
      { title: 'Approval', code: '2.2', icon: '/icon/icon_user.svg', showable: true, url: '/admin/user/approve' },
      { title: 'Update', code: '2.3', icon: '/icon/icon_update.svg', showable: false, url: '/admin/user/update' },
      { title: 'Reports', code: '2.5', icon: '/icon/icon_list.svg', showable: true, url: '/admin/user/report' },
      { title: 'Delete', code: '2.6', icon: '/icon/icon_delete.svg', showable: false, url: '/admin/user/delete' },
    ],
  },
  /**
   * Profile Module
   */
  {
    title: 'Profile',
    code: '3',
    icon: '/icon/icon_profile.svg',
    showable: true,
    children: [
      { title: 'Info', code: '3.1', icon: '/icon/icon_list.svg', showable: true, url: '/admin/profile' },
      { title: 'Update', code: '3.2', icon: '/icon/icon_update.svg', showable: false, url: '/admin/profile/update' },
      {
        title: 'Picture Update',
        code: '3.3',
        icon: '/icon/icon_update.svg',
        showable: false,
        url: '/admin/profile/update',
      },
      {
        title: 'Password',
        code: '3.4',
        icon: '/icon/icon_update.svg',
        showable: true,
        url: '/admin/profile/update/password',
      },
    ],
  },
  /**
   * Master Settings Module
   */
  {
    title: 'Settings',
    code: '4',
    icon: '/icon/icon_settings.svg',
    showable: true,
    children: [
      { title: 'App Setting', code: '4.1', icon: '/icon/icon_create.svg', showable: true, url: '/admin/settings' },
      {
        title: 'TP Setting',
        code: '4.2.1',
        icon: '/icon/icon_create.svg',
        showable: true,
        url: '/admin/settings/tp/create',
      },
      {
        title: 'TP List',
        code: '4.2.2',
        icon: '/icon/icon_list.svg',
        showable: true,
        url: '/admin/settings/tp/list',
      },
      {
        title: 'TP Update',
        code: '4.2.3',
        icon: '/icon/icon_update.svg',
        showable: false,
        url: '/admin/settings/tp/update',
      },
      {
        title: 'TP Delete',
        code: '4.2.4',
        icon: '/icon/icon_delete.svg',
        showable: false,
        url: '/admin/settings/tp/delete',
      },
    ],
  },
  /**
   * Onboarding Module
   */
  {
    title: 'Onboarding',
    code: '5',
    icon: '/icon/icon_ekyc.svg',
    showable: true,
    children: [
      {
        title: 'Start',
        code: '#',
        icon: '/icon/icon_create.svg',
        showable: true,
        url: '/admin/onboarding',
      },
      {
        title: 'Simplified',
        code: '5.1.1',
        icon: '/icon/icon_nid.svg',
        showable: true,
        url: '/admin/onboarding/simplified',
      },
      {
        title: 'Regular',
        code: '5.2.1',
        icon: '/icon/icon_nid.svg',
        showable: true,
        url: '/admin/onboarding/regular',
      },
      {
        title: 'Upgrade',
        code: '5.1.3',
        icon: '/icon/icon_update.svg',
        showable: true,
        url: '/admin/onboarding/upgrade',
      },
      {
        title: 'User Report',
        code: '5.4',
        icon: '/icon/icon_list.svg',
        showable: true,
        url: '/admin/onboarding/report',
      },
      {
        title: 'Admin Report',
        code: '5.3',
        icon: '/icon/icon_list.svg',
        showable: true,
        url: '/admin/onboarding/admin-report',
      },
    ],
  },
  /**
   * Analytics Module
   */
  {
    title: 'Analytics',
    code: '6',
    icon: '/icon/icon_reports.svg',
    showable: true,
    children: [
      {
        title: 'Statistics',
        code: '6.1',
        icon: '/icon/icon_dashboard.svg',
        showable: true,
        url: '/admin/analytics/statistics',
      },
      {
        title: 'Access Log',
        code: '6.2',
        icon: '/icon/icon_reports.svg',
        showable: true,
        url: '/admin/analytics/access-log',
      },
      {
        title: 'Activity Log',
        code: '6.3',
        icon: '/icon/icon_reports.svg',
        showable: true,
        url: '/admin/analytics/activity-log',
      },
    ],
  },
  /**
   * Product Module
   */
  {
    title: 'Product',
    code: '7',
    icon: '/icon/icon_products.svg',
    showable: true,
    children: [
      {
        title: 'Create',
        code: '7.1',
        icon: '/icon/icon_create.svg',
        showable: true,
        url: '/admin/product/create',
      },
      {
        title: 'List',
        code: '7.2',
        icon: '/icon/icon_list.svg',
        showable: true,
        url: '/admin/product/list',
      },
      {
        title: 'Update',
        code: '7.3',
        icon: '/icon/icon_update.svg',
        showable: false,
        url: '/admin/product/update',
      },
      {
        title: 'Delete',
        code: '7.4',
        icon: '/icon/icon_delete.svg',
        showable: false,
        url: '/admin/product/delete',
      },
    ],
  },
  /**
   * Account Module
   */
  {
    title: 'Account',
    code: '8',
    icon: '/icon/icon_account.svg',
    showable: true,
    children: [
      {
        title: 'List',
        code: '8.1',
        icon: '/icon/icon_list.svg',
        showable: true,
        url: '/admin/account/list',
      },
      {
        title: 'Reopen',
        code: '8.2',
        icon: '/icon/icon_account.svg',
        showable: false,
        url: '/admin/account/reopen',
      },
      {
        title: 'Discard',
        code: '8.3',
        icon: '/icon/icon_account.svg',
        showable: false,
        url: '/admin/account/discard',
      },
      {
        title: 'Channel Search',
        code: '8.4',
        icon: '/icon/icon_account.svg',
        showable: true,
        url: '/admin/account/search',
      },
    ],
  },
  /**
   * NID Verification Module
   */
  {
    title: 'NID',
    code: '9',
    icon: '/icon/icon_nid.svg',
    showable: true,
    children: [
      {
        title: 'Verification',
        code: '9.1',
        icon: '/icon/icon_create.svg',
        showable: true,
        url: '/admin/nid/verification',
      },
      {
        title: 'List',
        code: '9.2',
        icon: '/icon/icon_list.svg',
        showable: true,
        url: '/admin/nid/list',
      },
    ],
  },
]
