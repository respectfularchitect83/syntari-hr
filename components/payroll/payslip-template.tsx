"use client"

import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

interface PayslipTemplateProps {
  employee: {
    id: string
    name: string
    position: string
    department: string
    employeeId: string
    taxId: string
    bankAccount: string
    paymentMethod: string
    age?: number
    medicalAidMembers?: number
  }
  payrollRun: {
    id: string
    period: string
    startDate: string
    endDate: string
    paymentDate: string
  }
  earnings: Array<{
    type: string
    amount: number
    description?: string
    taxable: boolean
  }>
  deductions: Array<{
    type: string
    amount: number
    description?: string
    statutory: boolean
  }>
  tax: {
    taxableIncome: number
    taxPayable: number
    effectiveRate: number
    rebates?: {
      primary: number
      secondary: number
      tertiary: number
      medicalAid: number
      total: number
    }
  }
  summary: {
    totalEarnings: number
    totalDeductions: number
    netPay: number
  }
  companyInfo: {
    name: string
    address: string
    logo?: string
    registrationNumber: string
    taxId: string
    country: string
  }
  options?: {
    includeYTD?: boolean
    includeLeaveBalance?: boolean
  }
}

export function PayslipTemplate({
  employee,
  payrollRun,
  earnings,
  deductions,
  tax,
  summary,
  companyInfo,
  options = {},
}: PayslipTemplateProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NA", {
      style: "currency",
      currency: "NAD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border border-gray-200 print:border-none print:shadow-none">
      <CardContent className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PAYSLIP</h1>
            <p className="text-gray-500">
              Period: {format(new Date(payrollRun.startDate), "dd MMM yyyy")} -{" "}
              {format(new Date(payrollRun.endDate), "dd MMM yyyy")}
            </p>
          </div>
          <div className="text-right">
            {companyInfo.logo ? (
              <img src={companyInfo.logo || "/placeholder.svg"} alt={companyInfo.name} className="h-12 mb-2" />
            ) : (
              <div className="h-12 mb-2 font-bold text-xl">{companyInfo.name}</div>
            )}
            <p className="text-sm text-gray-500 whitespace-pre-line">{companyInfo.address}</p>
          </div>
        </div>

        {/* Employee & Company Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-1">EMPLOYEE INFORMATION</h2>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{employee.name}</p>
              <p className="text-gray-700">
                {employee.position}, {employee.department}
              </p>
              <p className="text-gray-700">Employee ID: {employee.employeeId}</p>
              <p className="text-gray-700">Tax ID: {employee.taxId}</p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-1">PAYMENT INFORMATION</h2>
            <div className="space-y-1">
              <p className="text-gray-700">Payment Date: {format(new Date(payrollRun.paymentDate), "dd MMM yyyy")}</p>
              <p className="text-gray-700">Payment Method: {employee.paymentMethod}</p>
              <p className="text-gray-700">Bank Account: {employee.bankAccount}</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Earnings & Deductions */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-3">EARNINGS</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.type}
                      {item.description && <span className="text-xs text-gray-500 block">{item.description}</span>}
                      {item.taxable && <span className="text-xs text-blue-600 block">Taxable</span>}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-3">DEDUCTIONS</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deductions.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.type}
                      {item.description && <span className="text-xs text-gray-500 block">{item.description}</span>}
                      {item.statutory && <span className="text-xs text-blue-600 block">Statutory</span>}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Tax Calculation */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">TAX CALCULATION</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Taxable Income</p>
                <p className="font-semibold text-gray-900">{formatCurrency(tax.taxableIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tax Payable</p>
                <p className="font-semibold text-gray-900">{formatCurrency(tax.taxPayable)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Effective Rate</p>
                <p className="font-semibold text-gray-900">{tax.effectiveRate.toFixed(2)}%</p>
              </div>
              {tax.rebates && tax.rebates.total > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Tax Rebates</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(tax.rebates.total)}</p>
                </div>
              )}
            </div>

            {tax.rebates && tax.rebates.total > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Rebate Breakdown:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {tax.rebates.primary > 0 && (
                    <div>
                      <span className="text-gray-500">Primary: </span>
                      <span className="font-medium">{formatCurrency(tax.rebates.primary)}</span>
                    </div>
                  )}
                  {tax.rebates.secondary > 0 && (
                    <div>
                      <span className="text-gray-500">Secondary: </span>
                      <span className="font-medium">{formatCurrency(tax.rebates.secondary)}</span>
                    </div>
                  )}
                  {tax.rebates.tertiary > 0 && (
                    <div>
                      <span className="text-gray-500">Tertiary: </span>
                      <span className="font-medium">{formatCurrency(tax.rebates.tertiary)}</span>
                    </div>
                  )}
                  {tax.rebates.medicalAid > 0 && (
                    <div>
                      <span className="text-gray-500">Medical: </span>
                      <span className="font-medium">{formatCurrency(tax.rebates.medicalAid)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tax calculated according to {companyInfo.country} tax regulations for the current tax year.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="font-semibold text-gray-900">{formatCurrency(summary.totalEarnings)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Deductions</p>
              <p className="font-semibold text-gray-900">{formatCurrency(summary.totalDeductions)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Net Pay</p>
              <p className="font-bold text-lg text-gray-900">{formatCurrency(summary.netPay)}</p>
            </div>
          </div>
        </div>

        {/* Year-to-Date Totals (Optional) */}
        {options.includeYTD && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-3">YEAR-TO-DATE TOTALS</h2>
            <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-md">
              <div>
                <p className="text-sm text-gray-500">YTD Earnings</p>
                <p className="font-semibold text-gray-900">{formatCurrency(summary.totalEarnings * 5)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">YTD Deductions</p>
                <p className="font-semibold text-gray-900">{formatCurrency(summary.totalDeductions * 5)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">YTD Tax Paid</p>
                <p className="font-semibold text-gray-900">{formatCurrency(tax.taxPayable * 5)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Leave Balance (Optional) */}
        {options.includeLeaveBalance && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-3">LEAVE BALANCE</h2>
            <div className="grid grid-cols-4 gap-4 bg-green-50 p-4 rounded-md">
              <div>
                <p className="text-sm text-gray-500">Annual Leave</p>
                <p className="font-semibold text-gray-900">15 days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sick Leave</p>
                <p className="font-semibold text-gray-900">10 days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Family Resp.</p>
                <p className="font-semibold text-gray-900">3 days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Study Leave</p>
                <p className="font-semibold text-gray-900">5 days</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>This is a computer-generated document and does not require a signature.</p>
          <p className="mt-1">
            {companyInfo.name} | Registration No: {companyInfo.registrationNumber} | Tax ID: {companyInfo.taxId}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
