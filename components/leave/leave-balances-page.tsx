"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { LeaveBalanceCard } from "./leave-balance-card"
import { DepartmentFilter } from "@/components/dashboard/department-filter"
import type { EmployeeLeaveBalances } from "@/types/leave-balance"

// Mock data for employee leave balances
const mockEmployeeLeaveBalances: EmployeeLeaveBalances[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    photo: "/professional-woman-headshot.png",
    department: "Human Resources",
    balances: {
      vacation: { entitled: 20, taken: 5, pending: 2, remaining: 13 },
      sick: { entitled: 10, taken: 2, pending: 0, remaining: 8 },
      personal: { entitled: 3, taken: 1, pending: 0, remaining: 2 },
    },
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    photo: "/professional-man-headshot.png",
    department: "Engineering",
    balances: {
      vacation: { entitled: 20, taken: 8, pending: 5, remaining: 7 },
      sick: { entitled: 10, taken: 3, pending: 0, remaining: 7 },
      personal: { entitled: 3, taken: 2, pending: 0, remaining: 1 },
    },
  },
  {
    id: "3",
    name: "Emily Wong",
    photo: "/asian-woman-professional-headshot.png",
    department: "Engineering",
    balances: {
      vacation: { entitled: 25, taken: 10, pending: 0, remaining: 15 },
      sick: { entitled: 12, taken: 0, pending: 0, remaining: 12 },
      personal: { entitled: 5, taken: 1, pending: 1, remaining: 3 },
    },
  },
  {
    id: "4",
    name: "David Chen",
    photo: "/asian-man-professional-headshot.png",
    department: "Executive",
    balances: {
      vacation: { entitled: 30, taken: 12, pending: 0, remaining: 18 },
      sick: { entitled: 15, taken: 0, pending: 0, remaining: 15 },
      personal: { entitled: 5, taken: 0, pending: 0, remaining: 5 },
    },
  },
  {
    id: "5",
    name: "Aisha Patel",
    photo: "/indian-woman-professional-headshot.png",
    department: "Marketing",
    balances: {
      vacation: { entitled: 20, taken: 15, pending: 5, remaining: 0 },
      sick: { entitled: 10, taken: 5, pending: 0, remaining: 5 },
      personal: { entitled: 3, taken: 3, pending: 0, remaining: 0 },
      maternity: { entitled: 90, taken: 0, pending: 90, remaining: 0 },
    },
  },
  {
    id: "6",
    name: "James Wilson",
    photo: "/professional-black-man.png",
    department: "Sales",
    balances: {
      vacation: { entitled: 20, taken: 7, pending: 0, remaining: 13 },
      sick: { entitled: 10, taken: 2, pending: 0, remaining: 8 },
      personal: { entitled: 3, taken: 0, pending: 0, remaining: 3 },
    },
  },
]

export default function LeaveBalancesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [showDepartmentFilter, setShowDepartmentFilter] = useState(false)
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(null)

  // Get unique departments
  const departments = Array.from(new Set(mockEmployeeLeaveBalances.map((emp) => emp.department)))

  // Get unique leave types
  const leaveTypes = Array.from(new Set(mockEmployeeLeaveBalances.flatMap((emp) => Object.keys(emp.balances))))

  const toggleDepartmentFilter = () => {
    setShowDepartmentFilter(!showDepartmentFilter)
  }

  const handleDepartmentSelect = (department: string | null) => {
    setSelectedDepartment(department)
    setShowDepartmentFilter(false)
  }

  // Filter employees based on search query, department, and leave type
  const filteredEmployees = mockEmployeeLeaveBalances.filter((employee) => {
    // Filter by search query
    if (
      searchQuery &&
      !employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !employee.department.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by department
    if (selectedDepartment && employee.department !== selectedDepartment) {
      return false
    }

    // Filter by leave type
    if (selectedLeaveType && !(selectedLeaveType in employee.balances)) {
      return false
    }

    return true
  })

  return (
    <DashboardLayout>
      <div className="p-6 pt-0">
        <div className="flex justify-between items-center pt-[4.5rem] pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Leave Balances</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by employee or department"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64 relative">
            <Button
              variant="outline"
              size="default"
              className="w-full flex items-center justify-between"
              onClick={toggleDepartmentFilter}
            >
              <div className="flex items-center">
                <Filter size={16} className="mr-2" />
                {selectedDepartment ? selectedDepartment : "All Departments"}
              </div>
            </Button>
            {showDepartmentFilter && (
              <DepartmentFilter
                departments={departments}
                selectedDepartment={selectedDepartment}
                onSelect={handleDepartmentSelect}
                onClose={() => setShowDepartmentFilter(false)}
              />
            )}
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedLeaveType || ""} onValueChange={(value) => setSelectedLeaveType(value || null)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Filter by leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leave Types</SelectItem>
                {leaveTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <LeaveBalanceCard key={employee.id} employee={employee} selectedLeaveType={selectedLeaveType} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500">
              No employees found matching your filters.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
