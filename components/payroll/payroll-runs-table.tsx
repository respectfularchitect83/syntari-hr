"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, MoreHorizontal, Mail, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GeneratePayslipDialog } from "./generate-payslip-dialog"

// Mock data for payroll runs
const mockPayrollRuns = [
  {
    id: "PR001",
    period: "May 2025",
    startDate: "2025-05-01",
    endDate: "2025-05-31",
    paymentDate: "2025-05-31",
    status: "Completed",
    employeeCount: 42,
    totalAmount: 1250000,
  },
  {
    id: "PR002",
    period: "April 2025",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    paymentDate: "2025-04-30",
    status: "Completed",
    employeeCount: 40,
    totalAmount: 1200000,
  },
  {
    id: "PR003",
    period: "March 2025",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    paymentDate: "2025-03-31",
    status: "Completed",
    employeeCount: 38,
    totalAmount: 1150000,
  },
  {
    id: "PR004",
    period: "June 2025",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    paymentDate: "2025-06-30",
    status: "Draft",
    employeeCount: 42,
    totalAmount: 1260000,
  },
]

export function PayrollRunsTable() {
  const [payrollRuns, setPayrollRuns] = useState(mockPayrollRuns)
  const [showPayslipDialog, setShowPayslipDialog] = useState(false)
  const [selectedPayrollRun, setSelectedPayrollRun] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      case "Error":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NA", {
      style: "currency",
      currency: "NAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleGeneratePayslips = (payrollRunId: string) => {
    setSelectedPayrollRun(payrollRunId)
    setShowPayslipDialog(true)
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollRuns.map((run) => (
              <TableRow key={run.id}>
                <TableCell className="font-medium">
                  {run.period}
                  <div className="text-xs text-gray-500">
                    {run.startDate} to {run.endDate}
                  </div>
                </TableCell>
                <TableCell>{run.paymentDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(run.status)} variant="outline">
                    {run.status}
                  </Badge>
                </TableCell>
                <TableCell>{run.employeeCount}</TableCell>
                <TableCell>{formatCurrency(run.totalAmount)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <Button variant="outline" size="icon" className="h-8 w-8 mr-2">
                      <Eye size={16} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleGeneratePayslips(run.id)}>
                          <FileText size={16} className="mr-2" />
                          Generate Payslips
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail size={16} className="mr-2" />
                          Email Payslips
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download size={16} className="mr-2" />
                          Download All
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showPayslipDialog && selectedPayrollRun && (
        <GeneratePayslipDialog
          open={showPayslipDialog}
          onClose={() => setShowPayslipDialog(false)}
          payrollRunId={selectedPayrollRun}
          isMultiple={true}
        />
      )}
    </div>
  )
}
