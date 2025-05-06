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

  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return "Good morning"
    } else if (hour >= 12 && hour < 18) {
      return "Good afternoon"
    } else {
      return "Good evening"
    }
  }

  // Mock data for statistics and their details
  const stats = [
    {
      title: "Total Employees",
      value: "124",
      details: [], // No flip details for total employees
    },
    {
      title: "On Leave Today",
      value: "7",
      details: [
        { id: "5", name: "Aisha Patel", department: "Marketing" },
        { id: "8", name: "Robert Johnson", department: "Finance" },
        { id: "12", name: "Maria Garcia", department: "Customer Support" },
        { id: "15", name: "Thomas Lee", department: "Engineering" },
        { id: "22", name: "Sophia Williams", department: "Sales" },
        { id: "27", name: "Daniel Brown", department: "Operations" },
        { id: "31", name: "Olivia Martinez", department: "Human Resources" },
      ],
    },
    {
      title: "Birthdays This Week",
      value: "3",
      details: [
        { id: "4", name: "David Chen", department: "Executive" },
        { id: "17", name: "Emma Wilson", department: "Design" },
        { id: "23", name: "Noah Taylor", department: "Product" },
      ],
    },
    {
      title: "Work Anniversaries",
      value: "2",
      details: [
        { id: "3", name: "Emily Wong", department: "Engineering" },
        { id: "9", name: "William Davis", department: "Legal" },
      ],
    },
  ]

  // Mock data for employees
  const employees: Employee[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      photo: "/professional-woman-headshot.png",
      department: "Human Resources",
      position: "HR Manager",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      birthday: "May 15",
      hireDate: "Jan 10, 2018",
      manager: "David Chen",
      status: "Active",
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      photo: "/professional-man-headshot.png",
      department: "Engineering",
      position: "Senior Developer",
      email: "michael.rodriguez@company.com",
      phone: "+1 (555) 234-5678",
      birthday: "July 23",
      hireDate: "Mar 5, 2019",
      manager: "Emily Wong",
      status: "Active",
    },
    {
      id: "3",
      name: "Emily Wong",
      photo: "/asian-woman-professional-headshot.png",
      department: "Engineering",
      position: "Engineering Director",
      email: "emily.wong@company.com",
      phone: "+1 (555) 345-6789",
      birthday: "Feb 8",
      hireDate: "Jun 15, 2016",
      manager: "David Chen",
      status: "Active",
    },
    {
      id: "4",
      name: "David Chen",
      photo: "/asian-man-professional-headshot.png",
      department: "Executive",
      position: "CTO",
      email: "david.chen@company.com",
      phone: "+1 (555) 456-7890",
      birthday: "Nov 30",
      hireDate: "Aug 1, 2015",
      manager: "Lisa Taylor",
      status: "Active",
    },
    {
      id: "5",
      name: "Aisha Patel",
      photo: "/indian-woman-professional-headshot.png",
      department: "Marketing",
      position: "Marketing Manager",
      email: "aisha.patel@company.com",
      phone: "+1 (555) 567-8901",
      birthday: "Apr 12",
      hireDate: "Sep 20, 2020",
      manager: "Lisa Taylor",
      status: "On Leave",
    },
    {
      id: "6",
      name: "James Wilson",
      photo: "/professional-black-man.png",
      department: "Sales",
      position: "Sales Director",
      email: "james.wilson@company.com",
      phone: "+1 (555) 678-9012",
      birthday: "Aug 3",
      hireDate: "Feb 12, 2017",
      manager: "Lisa Taylor",
      status: "Active",
    },
  ]

  // Get unique departments for filter
  const departments = Array.from(new Set(employees.map((emp) => emp.department)))

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
            {getGreeting()}, <span className="font-shadows-into-light">{currentUser.name.split(" ")[0]}</span>
          </h1>
          <div className="flex items-center gap-4">
            <Button
              className="bg-[#454636] hover:bg-[#5a5b47] text-white rounded-lg flex items-center gap-2 shadow-md"
              onClick={handleAddEmployee}
            >
              <PlusCircle size={18} />
              Add Employee
            </Button>
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

        {/* Stats Section with Flippable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <FlipCard
              key={index}
              title={stat.title}
              value={stat.value}
              details={stat.details}
              onPersonClick={handlePersonClick}
            />
          ))}
        </div>

        {/* Employees Section with Filter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Employees</h2>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                onClick={toggleDepartmentFilter}
              >
                <Filter size={16} />
                {selectedDepartment ? selectedDepartment : "All Departments"}
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} onClick={() => handleEmployeeClick(employee)} />
            ))}
          </div>
        </div>
      </div>

      {/* Employee Details Modal */}
      {showEmployeeDetails && selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          onClose={handleCloseDetails}
          onEdit={() => handleEditEmployee(selectedEmployee)}
        />
      )}

      {/* Employee Form Modal */}
      {showEmployeeForm && <EmployeeForm employee={employeeToEdit} onClose={handleCloseForm} />}
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
