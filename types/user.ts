export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  active: boolean
  lastLogin?: Date
  createdAt: Date
}

export enum UserRole {
  OWNER = "OWNER",
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  HR_MANAGER = "HR_MANAGER",
  PAYROLL_MANAGER = "PAYROLL_MANAGER",
  STANDARD = "STANDARD",
}

export interface UserInvite {
  id: string
  email: string
  role: UserRole
  invitedBy: string
  invitedAt: Date
  expiresAt: Date
  status: "PENDING" | "ACCEPTED" | "EXPIRED"
}
