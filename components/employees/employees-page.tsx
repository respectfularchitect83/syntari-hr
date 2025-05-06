"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EmployeeCard } from "@/components/dashboard/employee-card"
import { EmployeeDetails } from "@/components/dashboard/employee-details"
import { EmployeeForm } from "@/components/dashboard/employee-form"
import { DepartmentFilter } from "@/components/dashboard/department-filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, Filter } from "lucide-react"
import type { Employee } from "@/components/dashboard/dashboard-page"

export default function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false)
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | undefined>(undefined)
  const [showDepartmentFilter, setShowDepartmentFilter] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [banner, setBanner] = useState<{ type: "error" | "success", message: string } | null>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/employees")
        if (!res.ok) throw new Error("Failed to fetch employees")
        setEmployees(await res.json())
      } catch (err: any) {
        setError(err.message || "Failed to fetch employees")
      } finally {
        setLoading(false)
      }
    }
    fetchEmployees()
  }, [])

  // Get unique departments for filter
  const departments = Array.from(new Set(employees.map((emp) => emp.department)))

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowEmployeeDetails(true)
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

  const toggleDepartmentFilter = () => {
    setShowDepartmentFilter(!showDepartmentFilter)
  }

  const handleDepartmentSelect = (department: string | null) => {
    setSelectedDepartment(department)
    setShowDepartmentFilter(false)
  }

  // Filter employees by department if one is selected and by search query
  const filteredEmployees = employees.filter((employee) => {
    // Filter by department
    if (selectedDepartment && employee.department !== selectedDepartment) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !employee.position.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !employee.department.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

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
        {error && <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded" role="alert">{error}</div>}
        {loading ? (
          <div className="text-center py-8"><span className="loader" aria-label="Loading" /></div>
        ) : employees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No employees found.</div>
        ) : (
          <div className="p-6 pt-0">
            <div className="flex justify-between items-center pt-[4.5rem] pb-6">
              <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
              <Button
                className="bg-[#454636] hover:bg-[#5a5b47] text-white rounded-lg flex items-center gap-2 shadow-md"
                onClick={handleAddEmployee}
              >
                <PlusCircle size={18} />
                Add Employee
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by name, position, or department"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <Button
                  variant="outline"
                  size="default"
                  className="w-full md:w-auto flex items-center gap-2"
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
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} onClick={() => handleEmployeeClick(employee)} />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-gray-500">
                  No employees found matching your filters.
                </div>
              )}
            </div>
          </div>
        )}
        <style jsx>{`
          .loader {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            display: inline-block;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

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
      </div>
    </DashboardLayout>
  )
}
