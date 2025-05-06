"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, Search, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { GeneratePayslipDialog } from "./generate-payslip-dialog"

// Mock data for employee payroll
const mockEmployeePayroll = [
  {
    id: "1",
    name: "Sarah Johnson",
    department: "Human Resources",
    position: "HR Manager",
    paymentMethod: "Monthly",
    baseSalary: 45000,
    lastPayDate: "2025-05-28",
    bankAccount: "****3456",
    status: "Active",
  },
  {
    id: "2",
    name: "Michael Chen",
    department: "Engineering",
    position: "Senior Developer",
    paymentMethod: "Monthly",
    baseSalary: 65000,
    lastPayDate: "2025-05-28",
    bankAccount: "****7890",
    status: "Active",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    department: "Marketing",
    position: "Marketing Specialist",
    paymentMethod: "Monthly",
    baseSalary: 38000,
    lastPayDate: "2025-05-28",
    bankAccount: "****2345",
    status: "Active",
  },
  {
    id: "4",
    name: "David Ndlovu",
    department: "Sales",
    position: "Sales Representative",
    paymentMethod: "Hourly",
    baseSalary: 25,
    lastPayDate: "2025-05-28",
    bankAccount: "****8901",
    status: "Active",
  },
  {
    id: "5",
    name: "Lisa van Wyk",
    department: "Customer Support",
    position: "Support Specialist",
    paymentMethod: "Hourly",
    baseSalary: 22,
    lastPayDate: "2025-05-28",
    bankAccount: "****5678",
    status: "On Leave",
  },
]

export function PayrollEmployeesTable() {
  const [employees, setEmployees] = useState(mockEmployeePayroll)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("All")
  const [showPayslipDialog, setShowPayslipDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  // Get unique departments for filter
  const departments = ["All", ...new Set(mockEmployeePayroll.map((emp) => emp.department))]

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = departmentFilter === "All" || employee.department === departmentFilter

    const matchesPaymentMethod = paymentMethodFilter === "All" || employee.paymentMethod === paymentMethodFilter

    return matchesSearch && matchesDepartment && matchesPaymentMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "On Leave":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "Terminated":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatCurrency = (amount: number, isHourly: boolean) => {
    return (
      new Intl.NumberFormat("en-NA", {
        style: "currency",
        currency: "NAD",
        minimumFractionDigits: 2,
      }).format(amount) + (isHourly ? "/hr" : "")
    )
  }

  const handleGeneratePayslip = (employeeId: string) => {
    setSelectedEmployee(employeeId)
    setShowPayslipDialog(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-48">
            <Label htmlFor="departmentFilter" className="sr-only">
              Department
            </Label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger id="departmentFilter" className="bg-white">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <Label htmlFor="paymentMethodFilter" className="sr-only">
              Payment Method
            </Label>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger id="paymentMethodFilter" className="bg-white">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Methods</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Hourly">Hourly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Base Rate</TableHead>
              <TableHead>Last Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.paymentMethod}</TableCell>
                <TableCell>{formatCurrency(employee.baseSalary, employee.paymentMethod === "Hourly")}</TableCell>
                <TableCell>{employee.lastPayDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(employee.status)} variant="outline">
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleGeneratePayslip(employee.id)}
                    >
                      <FileText size={16} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Mail size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                  No employees found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPayslipDialog && selectedEmployee && (
        <GeneratePayslipDialog
          open={showPayslipDialog}
          onClose={() => setShowPayslipDialog(false)}
          payrollRunId="PR001" // In a real app, this would be the current payroll run ID
          employeeId={selectedEmployee}
        />
      )}
    </div>
  )
}
