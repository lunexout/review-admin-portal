export type Permission = (typeof permissions)[keyof typeof permissions]
export const permissions = {
  // High-level access
  accessAdminPortal: 'access:admin-portal',
  businessManage: 'business:manage'
} as const

export type PredefinedRoleKey = keyof typeof predefinedRoles
export type PredefinedRoleName = (typeof predefinedRoles)[PredefinedRoleKey]
export const predefinedRoles = {
  Admin: 'Admin',
  BusinessAdmin: 'Business Admin',
  BusinessCto: 'Business CTO',
  BusinessMember: 'Business memeber',
  Visitor: 'Visitor'
} as const

export const predefinedPermissions = {
  [predefinedRoles.Admin]: [
    permissions.accessAdminPortal,
    permissions.businessManage
  ],
  [predefinedRoles.BusinessAdmin]: [],
  [predefinedRoles.BusinessCto]: [],
  [predefinedRoles.BusinessMember]: [],
  [predefinedRoles.Visitor]: []
}

type SigninMethodForRole = 'not_allowed' | 'credentials' | 'oauth'

export const getAllowedSigninMethod = (
  role: PredefinedRoleName | string
): SigninMethodForRole => {
  if (role === predefinedRoles.Admin) {
    return 'oauth'
  }
  return 'not_allowed'
}
