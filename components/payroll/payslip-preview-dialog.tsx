"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PayslipTemplate } from "./payslip-template"
import { Printer, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PayslipPreviewDialogProps {
  open: boolean
  onClose: () => void
  employeeId: string
  payrollRunId: string
  options?: {
    includeYTD?: boolean
    includeLeaveBalance?: boolean
  }
}

export function PayslipPreviewDialog({
  open,
  onClose,
  employeeId,
  payrollRunId,
  options = {},
}: PayslipPreviewDialogProps) {
  const { toast } = useToast()

  // Mock data for preview
  const mockEmployee = {
    id: employeeId,
    name: "Sarah Johnson",
    position: "HR Manager",
    department: "Human Resources",
    employeeId: "EMP001",
    taxId: "TAX123456",
    bankAccount: "****3456",
    paymentMethod: "Monthly",
    age: 35,
    medicalAidMembers: 2,
  }

  const mockPayrollRun = {
    id: payrollRunId,
    period: "May 2025",
    startDate: "2025-05-01",
    endDate: "2025-05-31",
    paymentDate: "2025-05-28",
  }

  const mockEarnings = [
    { type: "Basic Salary", amount: 45000, description: "", taxable: true },
    { type: "Housing Allowance", amount: 5000, description: "", taxable: true },
    { type: "Transport Allowance", amount: 2500, description: "", taxable: true },
    { type: "Performance Bonus", amount: 3000, description: "Q1 Performance", taxable: true },
  ]

  const mockDeductions = [
    { type: "Income Tax (PAYE)", amount: 12375, description: "", statutory: true },
    { type: "Pension Fund", amount: 4500, description: "10% of basic salary", statutory: false },
    { type: "Medical Aid", amount: 3200, description: "Family coverage", statutory: false },
    { type: "Social Security", amount: 900, description: "2% of basic salary", statutory: true },
  ]

  const mockTax = {
    taxableIncome: 55500, // Basic + Housing + Transport + Bonus
    taxPayable: 12375,
    effectiveRate: 22.3,
    rebates: {
      primary: 1436.25,
      secondary: 0,
      tertiary: 0,
      medicalAid: 694,
      total: 2130.25,
    },
  }

  const mockSummary = {
    totalEarnings: 55500,
    totalDeductions: 20975,
    netPay: 34525,
  }

  const mockCompanyInfo = {
    name: "Syntari HR Solutions",
    address: "123 Business Park\nWindhoek\nNamibia",
    registrationNumber: "REG12345",
    taxId: "TAX987654",
    country: "Namibia",
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your payslip is being downloaded as a PDF.",
    })
    // In a real app, this would trigger a PDF download
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <div className="flex justify-end space-x-2 mb-4 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer size={16} className="mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <PayslipTemplate
            employee={mockEmployee}
            payrollRun={mockPayrollRun}
            earnings={mockEarnings}
            deductions={mockDeductions}
            tax={mockTax}
            summary={mockSummary}
            companyInfo={mockCompanyInfo}
            options={options}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
