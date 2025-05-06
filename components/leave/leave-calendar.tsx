"use client"

import { useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWeekend,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { leaveTypes } from "./leave-request-form"
import type { LeaveRequest } from "@/types/leave"

interface LeaveCalendarProps {
  leaves: LeaveRequest[]
  onDayClick?: (date: Date, leaves: LeaveRequest[]) => void
}

export function LeaveCalendar({ leaves, onDayClick }: LeaveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get all leaves that overlap with the current month
  const currentMonthLeaves = leaves.filter((leave) => {
    const startDate = new Date(leave.startDate)
    const endDate = new Date(leave.endDate)
    return startDate <= monthEnd && endDate >= monthStart && leave.status === "approved"
  })

  // Check if a date has any approved leaves
  const getLeavesForDate = (date: Date) => {
    return currentMonthLeaves.filter((leave) => {
      const startDate = new Date(leave.startDate)
      const endDate = new Date(leave.endDate)
      return date >= startDate && date <= endDate && !isWeekend(date)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Leave Calendar</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array(monthStart.getDay())
          .fill(null)
          .map((_, index) => (
            <div key={`empty-start-${index}`} className="h-12 p-1" />
          ))}

        {monthDays.map((day) => {
          const dayLeaves = getLeavesForDate(day)
          const isWeekendDay = isWeekend(day)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "h-12 p-1 border rounded-md relative",
                isWeekendDay ? "bg-gray-50" : "hover:bg-gray-50 cursor-pointer",
                !isSameMonth(day, currentMonth) && "text-gray-300",
              )}
              onClick={() => !isWeekendDay && dayLeaves.length > 0 && onDayClick && onDayClick(day, dayLeaves)}
            >
              <span
                className={cn(
                  "text-xs inline-block w-5 h-5 rounded-full text-center leading-5",
                  isSameDay(day, new Date()) && "bg-[#454636] text-white",
                )}
              >
                {format(day, "d")}
              </span>

              {dayLeaves.length > 0 && (
                <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-0.5">
                  {dayLeaves.slice(0, 3).map((leave, index) => {
                    const leaveType = leaveTypes.find((type) => type.id === leave.leaveType)
                    return (
                      <div
                        key={`${leave.id}-${index}`}
                        className={cn("h-1.5 flex-1 rounded-sm", leaveType?.color || "bg-gray-300")}
                        title={`${leave.employeeName} - ${leaveType?.name || "Leave"}`}
                      />
                    )
                  })}
                  {dayLeaves.length > 3 && (
                    <span className="text-[9px] text-gray-500 ml-auto">+{dayLeaves.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {Array(6 - ((monthDays.length + monthStart.getDay() - 1) % 7))
          .fill(null)
          .filter((_, i) => i > 0 || (monthDays.length + monthStart.getDay()) % 7 !== 0)
          .map((_, index) => (
            <div key={`empty-end-${index}`} className="h-12 p-1" />
          ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {leaveTypes.slice(0, 6).map((type) => (
          <div key={type.id} className="flex items-center text-xs">
            <div className={`w-2 h-2 rounded-full ${type.color} mr-1`} />
            <span className="text-gray-600">{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
