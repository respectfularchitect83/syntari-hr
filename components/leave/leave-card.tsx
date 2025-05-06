"use client"

import { format } from "date-fns"
import { LeaveStatusBadge } from "./leave-status-badge"
import { leaveTypes } from "./leave-request-form"
import { Button } from "@/components/ui/button"
import { Check, X, MessageCircle } from "lucide-react"
import type { LeaveRequest } from "@/types/leave"

interface LeaveCardProps {
  leave: LeaveRequest
  isManager?: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onComment?: (id: string) => void
  onView?: (id: string) => void
}

export function LeaveCard({ leave, isManager = false, onApprove, onReject, onComment, onView }: LeaveCardProps) {
  const leaveType = leaveTypes.find((type) => type.id === leave.leaveType) || {
    name: "Unknown",
    color: "bg-gray-500",
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${leaveType.color} mr-2`}></div>
          <h3 className="font-medium text-gray-900">{leaveType.name}</h3>
        </div>
        <LeaveStatusBadge status={leave.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Employee:</span>
          <span className="font-medium text-gray-900">{leave.employeeName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Duration:</span>
          <span className="font-medium text-gray-900">
            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Days:</span>
          <span className="font-medium text-gray-900">{leave.days}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Requested:</span>
          <span className="text-gray-600">{formatDate(leave.createdAt)}</span>
        </div>
      </div>

      {leave.reason && (
        <div className="mt-3 text-sm">
          <p className="text-gray-500 font-medium">Reason:</p>
          <p className="text-gray-700 mt-1">{leave.reason}</p>
        </div>
      )}

      {isManager && leave.status === "pending" && (
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => onReject && onReject(leave.id)}
          >
            <X size={16} className="mr-1" />
            Reject
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
            onClick={() => onApprove && onApprove(leave.id)}
          >
            <Check size={16} className="mr-1" />
            Approve
          </Button>
        </div>
      )}

      {!isManager && (
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => onView && onView(leave.id)}>
            View Details
          </Button>
        </div>
      )}

      {isManager && leave.status !== "pending" && (
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => onComment && onComment(leave.id)}>
            <MessageCircle size={16} className="mr-1" />
            Add Comment
          </Button>
        </div>
      )}
    </div>
  )
}
