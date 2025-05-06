"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, CalendarIcon, List } from "lucide-react"
import { LeaveRequestForm } from "./leave-request-form"
import { LeaveCard } from "./leave-card"
import { LeaveCalendar } from "./leave-calendar"
import { LeaveApprovalDialog } from "./leave-approval-dialog"
import { leaveTypes } from "./leave-request-form"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import type { LeaveRequest } from "@/types/leave"

// Mock data for current user
const currentUser = {
  id: "1",
  name: "Alex Morgan",
  role: "HR Administrator",
  isManager: true,
}

// Mock data for leave requests
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeId: "2",
    employeeName: "Michael Rodriguez",
    startDate: "2025-05-10T00:00:00.000Z",
    endDate: "2025-05-14T00:00:00.000Z",
    days: 5,
    leaveType: "vacation",
    reason: "Family vacation",
    contactInfo: "+1 (555) 234-5678",
    status: "approved",
    createdAt: "2025-04-25T10:30:00.000Z",
    approvedBy: "Alex Morgan",
    approvedAt: "2025-04-26T14:20:00.000Z",
    comments: "Approved. Enjoy your vacation!",
  },
  {
    id: "2",
    employeeId: "3",
    employeeName: "Emily Wong",
    startDate: "2025-05-20T00:00:00.000Z",
    endDate: "2025-05-21T00:00:00.000Z",
    days: 2,
    leaveType: "sick",
    reason: "Medical appointment",
    contactInfo: "+1 (555) 345-6789",
    status: "pending",
    createdAt: "2025-05-01T09:15:00.000Z",
    approvedBy: null,
    approvedAt: null,
    comments: "",
  },
  {
    id: "3",
    employeeId: "5",
    employeeName: "Aisha Patel",
    startDate: "2025-05-05T00:00:00.000Z",
    endDate: "2025-05-09T00:00:00.000Z",
    days: 5,
    leaveType: "maternity",
    reason: "Maternity leave",
    contactInfo: "+1 (555) 567-8901",
    status: "approved",
    createdAt: "2025-04-15T11:45:00.000Z",
    approvedBy: "Alex Morgan",
    approvedAt: "2025-04-16T10:30:00.000Z",
    comments: "Congratulations!",
  },
  {
    id: "4",
    employeeId: "6",
    employeeName: "James Wilson",
    startDate: "2025-05-15T00:00:00.000Z",
    endDate: "2025-05-15T00:00:00.000Z",
    days: 1,
    leaveType: "personal",
    reason: "Personal matters",
    contactInfo: "+1 (555) 678-9012",
    status: "rejected",
    createdAt: "2025-05-02T16:20:00.000Z",
    approvedBy: "Alex Morgan",
    approvedAt: "2025-05-03T09:10:00.000Z",
    comments: "Critical team meeting on this day. Please reschedule.",
  },
  {
    id: "5",
    employeeId: "1",
    employeeName: "Sarah Johnson",
    startDate: "2025-05-25T00:00:00.000Z",
    endDate: "2025-05-28T00:00:00.000Z",
    days: 4,
    leaveType: "vacation",
    reason: "Summer break",
    contactInfo: "+1 (555) 123-4567",
    status: "pending",
    createdAt: "2025-05-03T14:30:00.000Z",
    approvedBy: null,
    approvedAt: null,
    comments: "",
  },
]

export default function LeaveManagementPage() {
  const [showLeaveForm, setShowLeaveForm] = useState(false)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")
  const [approvalDialog, setApprovalDialog] = useState<{
    show: boolean
    leaveId: string
    action: "approve" | "reject"
  }>({ show: false, leaveId: "", action: "approve" })

  const handleLeaveFormSuccess = () => {
    // In a real app, you would fetch the updated leave requests
    // For now, we'll just close the form
    setShowLeaveForm(false)
  }

  const handleApprove = (leaveId: string) => {
    setApprovalDialog({ show: true, leaveId, action: "approve" })
  }

  const handleReject = (leaveId: string) => {
    setApprovalDialog({ show: true, leaveId, action: "reject" })
  }

  const handleApprovalSuccess = () => {
    // In a real app, you would fetch the updated leave requests
    // For now, we'll just update the mock data
    const updatedLeaves = leaveRequests.map((leave) => {
      if (leave.id === approvalDialog.leaveId) {
        return {
          ...leave,
          status: approvalDialog.action === "approve" ? "approved" : "rejected",
          approvedBy: currentUser.name,
          approvedAt: new Date().toISOString(),
        }
      }
      return leave
    })
    setLeaveRequests(updatedLeaves)
  }

  // Filter leave requests based on tab, search query, and filter type
  const filteredLeaves = leaveRequests.filter((leave) => {
    // Filter by tab
    if (activeTab !== "all" && leave.status !== activeTab) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !leave.reason.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by leave type
    if (filterType && leave.leaveType !== filterType) {
      return false
    }

    return true
  })

  // Get the leave request for the approval dialog
  const selectedLeave = leaveRequests.find((leave) => leave.id === approvalDialog.leaveId)

  return (
    <DashboardLayout>
      <div className="p-6 pt-0">
        <div className="flex justify-between items-center pt-[4.5rem] pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <Button
            className="bg-[#454636] hover:bg-[#5a5b47] text-white rounded-lg flex items-center gap-2 shadow-md"
            onClick={() => setShowLeaveForm(true)}
          >
            <PlusCircle size={18} />
            Request Leave
          </Button>
        </div>

        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={viewMode === "list" ? "bg-gray-100" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={viewMode === "calendar" ? "bg-gray-100" : ""}
                  onClick={() => setViewMode("calendar")}
                >
                  <CalendarIcon size={18} />
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by employee or reason"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Filter by leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${type.color} mr-2`}></div>
                          {type.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {viewMode === "list" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLeaves.length > 0 ? (
                    filteredLeaves.map((leave) => (
                      <LeaveCard
                        key={leave.id}
                        leave={leave}
                        isManager={currentUser.isManager}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-gray-500">
                      No leave requests found matching your filters.
                    </div>
                  )}
                </div>
              ) : (
                <LeaveCalendar leaves={filteredLeaves} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Leave Request Form */}
      {showLeaveForm && (
        <LeaveRequestForm
          employeeId={currentUser.id}
          employeeName={currentUser.name}
          onClose={() => setShowLeaveForm(false)}
          onSuccess={handleLeaveFormSuccess}
        />
      )}

      {/* Approval Dialog */}
      {approvalDialog.show && selectedLeave && (
        <LeaveApprovalDialog
          leave={selectedLeave}
          action={approvalDialog.action}
          onClose={() => setApprovalDialog({ show: false, leaveId: "", action: "approve" })}
          onSuccess={handleApprovalSuccess}
        />
      )}
    </DashboardLayout>
  )
}
