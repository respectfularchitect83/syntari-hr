export interface LeaveBalance {
  id: string
  employeeId: string
  employeeName: string
  employeePhoto: string
  department: string
  leaveType: string
  entitled: number
  taken: number
  pending: number
  remaining: number
}

export interface EmployeeLeaveBalances {
  id: string
  name: string
  photo: string
  department: string
  balances: {
    [key: string]: {
      entitled: number
      taken: number
      pending: number
      remaining: number
    }
  }
}
