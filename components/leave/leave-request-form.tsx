"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, X, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { submitLeaveRequest } from "@/actions/leave-actions"
import { cn } from "@/lib/utils"

interface LeaveRequestFormProps {
  employeeId: string
  employeeName: string
  onClose: () => void
  onSuccess?: () => void
}

// Leave types with descriptions and colors
export const leaveTypes = [
  {
    id: "vacation",
    name: "Vacation",
    color: "bg-blue-500",
    description: "Annual leave for holidays and personal time",
  },
  { id: "sick", name: "Sick Leave", color: "bg-red-500", description: "Leave due to illness or medical appointments" },
  { id: "personal", name: "Personal Leave", color: "bg-purple-500", description: "Leave for personal matters" },
  {
    id: "bereavement",
    name: "Bereavement",
    color: "bg-gray-500",
    description: "Leave due to death of a family member",
  },
  { id: "maternity", name: "Maternity", color: "bg-pink-500", description: "Leave for childbirth and bonding" },
  { id: "paternity", name: "Paternity", color: "bg-indigo-500", description: "Leave for new fathers" },
  { id: "unpaid", name: "Unpaid Leave", color: "bg-amber-500", description: "Leave without pay" },
  { id: "other", name: "Other", color: "bg-emerald-500", description: "Other types of leave" },
]

export function LeaveRequestForm({ employeeId, employeeName, onClose, onSuccess }: LeaveRequestFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [formData, setFormData] = useState({
    leaveType: "",
    reason: "",
    contactInfo: "",
    halfDay: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate || !endDate || !formData.leaveType) {
      // Show validation error
      return
    }

    setIsSubmitting(true)

    try {
      // Calculate days (excluding weekends)
      const days = calculateBusinessDays(startDate, endDate)

      const leaveRequest = {
        id: crypto.randomUUID(),
        employeeId,
        employeeName,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        days: formData.halfDay ? days - 0.5 : days,
        leaveType: formData.leaveType,
        reason: formData.reason,
        contactInfo: formData.contactInfo,
        status: "pending",
        createdAt: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null,
        comments: "",
      }

      await submitLeaveRequest(leaveRequest)

      // Refresh the page data
      router.refresh()

      // Notify parent component of success
      if (onSuccess) {
        onSuccess()
      }

      // Close the form
      onClose()
    } catch (error) {
      console.error("Error submitting leave request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate business days between two dates (excluding weekends)
  const calculateBusinessDays = (start: Date, end: Date): number => {
    let count = 0
    const curDate = new Date(start.getTime())
    while (curDate <= end) {
      const dayOfWeek = curDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++
      curDate.setDate(curDate.getDate() + 1)
    }
    return count
  }

  // Calculate the number of days selected
  const selectedDays = startDate && endDate ? calculateBusinessDays(startDate, endDate) : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Request Leave</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leave Type */}
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type *</Label>
              <Select
                value={formData.leaveType}
                onValueChange={(value) => handleSelectChange("leaveType", value)}
                required
              >
                <SelectTrigger id="leaveType" className="bg-white">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
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

            {/* Half Day Option */}
            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="halfDay"
                className="rounded border-gray-300 text-[#454636] focus:ring-[#454636]"
                checked={formData.halfDay}
                onChange={(e) => setFormData((prev) => ({ ...prev, halfDay: e.target.checked }))}
              />
              <Label htmlFor="halfDay" className="cursor-pointer">
                Half day on last day
              </Label>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={(date) => {
                      // Disable weekends and past dates
                      const day = date.getDay()
                      return date < new Date(new Date().setHours(0, 0, 0, 0)) || day === 0 || day === 6
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => {
                      // Disable weekends, past dates, and dates before start date
                      const day = date.getDay()
                      return (
                        date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                        (startDate && date < startDate) ||
                        day === 0 ||
                        day === 6
                      )
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Days Summary */}
          {startDate && endDate && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-medium">
                  {formData.halfDay ? selectedDays - 0.5 : selectedDays} business day
                  {(formData.halfDay ? selectedDays - 0.5 : selectedDays) !== 1 && "s"}
                </span>{" "}
                selected (excluding weekends)
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave *</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Please provide details about your leave request"
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information During Leave</Label>
            <Input
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              placeholder="Phone number or email where you can be reached if needed"
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#454636] hover:bg-[#5a5b47] text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
