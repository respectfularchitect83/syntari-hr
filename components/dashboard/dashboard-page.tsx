"use client"

import { useState, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FlipCard } from "@/components/dashboard/flip-card"
import { EmployeeCard } from "@/components/dashboard/employee-card"
import { EmployeeDetails } from "@/components/dashboard/employee-details"
import { EmployeeForm } from "@/components/dashboard/employee-form"
import { UserProfilePopup } from "@/components/dashboard/user-profile-popup"
import { DepartmentFilter } from "@/components/dashboard/department-filter"
import { Button } from "@/components/ui/button"
import { PlusCircle, Filter } from "lucide-react"
import Image from "next/image"
import { Session } from "next-auth"

export default function DashboardPage({ session }: { session: Session }) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false)
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | undefined>(undefined)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showDepartmentFilter, setShowDepartmentFilter] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ type: "error" | "success", message: string } | null>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  // Remove hardcoded currentUser, use session.user
  const currentUser = {
    name: session.user.name,
    email: session.user.email,
    photo: "/current-user-photo.png",
    role: session.user.role,
    organizationId: session.user.organizationId,
  }

  // TODO: Fetch real employee and stats data from backend instead of using mock data.

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowEmployeeDetails(true)
  }

  const handlePersonClick = (id: string) => {
    const employee =
      employees.find((emp) => emp.id === id) || employees.find((emp) => emp.name.includes(id.split(" ")[0]))

    if (employee) {
      setSelectedEmployee(employee)
      setShowEmployeeDetails(true)
    }
  }

  const handleCloseDetails = () => {
    setShowEmployeeDetails(false)
  }

  const handleAddEmployee = () => {
    setEmployeeToEdit(undefined)
    setShowEmployeeForm(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEmployeeToEdit(employee)
    setShowEmployeeForm(true)
    setShowEmployeeDetails(false)
  }

  const handleCloseForm = () => {
    setShowEmployeeForm(false)
    setEmployeeToEdit(undefined)
  }

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile)
  }

  const toggleDepartmentFilter = () => {
    setShowDepartmentFilter(!showDepartmentFilter)
  }

  const handleDepartmentSelect = (department: string | null) => {
    setSelectedDepartment(department)
    setShowDepartmentFilter(false)
  }

  // Filter employees by department if one is selected
  const filteredEmployees = selectedDepartment
    ? employees.filter((emp) => emp.department === selectedDepartment)
    : employees

  return (
    <DashboardLayout>
      <div className="p-6 pt-0" aria-live="polite">
        {banner && (
          <div
            ref={bannerRef}
            tabIndex={-1}
            className={`mb-4 px-4 py-2 rounded ${banner.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            role={banner.type === "success" ? "status" : "alert"}
            onAnimationEnd={() => setBanner(null)}
          >
            {banner.message}
          </div>
        )}
        <div className="flex justify-between items-center pt-[4.5rem] pb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, <span className="font-shadows-into-light">{currentUser.name.split(" ")[0]}</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-[#454636] shadow-md"
                onClick={toggleUserProfile}
              >
                <Image
                  src={currentUser.photo || "/placeholder.svg"}
                  alt="User profile"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              {showUserProfile && <UserProfilePopup user={currentUser} onClose={toggleUserProfile} />}
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-500">
          Employee data is now managed in the <b>Employees</b> page.
        </div>
      </div>
    </DashboardLayout>
  )
}

// Type definitions
export interface Employee {
  id: string
  name: string
  photo: string
  department: string
  position: string
  email: string
  phone: string
  birthday: string
  hireDate: string
  manager: string
  status: string
  workSchedule?: string
}

export interface PersonDetail {
  id: string
  name: string
  department: string
}
