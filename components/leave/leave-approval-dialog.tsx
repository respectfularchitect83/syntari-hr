"use client"

import type React from "react"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { approveLeaveRequest, rejectLeaveRequest } from "@/actions/leave-actions"
import type { LeaveRequest } from "@/types/leave"

interface LeaveApprovalDialogProps {
  leave: LeaveRequest
  action: "approve" | "reject"
  onClose: () => void
  onSuccess: () => void
}

export function LeaveApprovalDialog({ leave, action, onClose, onSuccess }: LeaveApprovalDialogProps) {
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (action === "approve") {
        await approveLeaveRequest(leave.id, comments)
      } else {
        await rejectLeaveRequest(leave.id, comments)
      }
      onSuccess()
    } catch (error) {
      console.error(`Error ${action}ing leave request:`, error)
    } finally {
      setIsSubmitting(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {action === "approve" ? "Approve Leave Request" : "Reject Leave Request"}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {action === "approve"
                ? "Are you sure you want to approve this leave request?"
                : "Are you sure you want to reject this leave request?"}
            </p>

            <div className="space-y-2">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                Comments (optional)
              </label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={
                  action === "approve"
                    ? "Add any comments or instructions for the employee"
                    : "Provide a reason for rejecting this request"
                }
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              className={
                action === "approve"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {action === "approve" ? "Approving..." : "Rejecting..."}
                </>
              ) : action === "approve" ? (
                "Approve"
              ) : (
                "Reject"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
