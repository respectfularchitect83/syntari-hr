export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  startDate: string
  endDate: string
  days: number
  leaveType: string
  reason: string
  contactInfo: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  createdAt: string
  approvedBy: string | null
  approvedAt: string | null
  comments: string
}
