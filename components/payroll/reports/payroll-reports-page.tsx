"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Download, FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Use dynamic imports with SSR disabled for chart components
const DepartmentExpensesChart = dynamic(() => import("./department-expenses-chart"), { ssr: false })
const PeriodComparisonChart = dynamic(() => import("./period-comparison-chart"), { ssr: false })
const ExpenseCategoryChart = dynamic(() => import("./expense-category-chart"), { ssr: false })
const PayrollTrendsChart = dynamic(() => import("./payroll-trends-chart"), { ssr: false })
import {
  mockDepartmentExpenses,
  mockPeriodComparison,
  mockExpenseCategories,
  mockPayrollTrends,
} from "./mock-payroll-data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function PayrollReportsPage() {
  const [activeTab, setActiveTab] = useState("department")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1), // 6 months ago
    to: new Date(),
  })

  // Get unique departments from mock data
  const departments = [
    { id: "all", name: "All Departments" },
    { id: "hr", name: "Human Resources" },
    { id: "eng", name: "Engineering" },
    { id: "exec", name: "Executive" },
    { id: "marketing", name: "Marketing" },
    { id: "sales", name: "Sales" },
    { id: "finance", name: "Finance" },
    { id: "operations", name: "Operations" },
  ]

  // Period options
  const periods = [
    { id: "monthly", name: "Monthly" },
    { id: "quarterly", name: "Quarterly" },
    { id: "yearly", name: "Yearly" },
  ]

  const handleExportData = (format: "csv" | "pdf") => {
    // In a real application, this would generate and download a file
    alert(`Exporting data as ${format.toUpperCase()}`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 pt-0">
        <div className="flex justify-between items-center pt-[4.5rem] pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payroll Reports</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExportData("csv")} className="cursor-pointer">
                <FileSpreadsheet size={16} className="mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportData("pdf")} className="cursor-pointer">
                <FilePdf size={16} className="mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="department">Department Expenses</TabsTrigger>
              <TabsTrigger value="period">Period Comparison</TabsTrigger>
              <TabsTrigger value="category">Expense Categories</TabsTrigger>
              <TabsTrigger value="trends">Payroll Trends</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Date Range Selector */}
              <div className="w-full md:w-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full md:w-auto justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Department Selector */}
              <div className="w-full md:w-64">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Period Selector */}
              <div className="w-full md:w-64">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="department" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Department Payroll Expenses</CardTitle>
                  <CardDescription>Compare payroll expenses across different departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <DepartmentExpensesChart
                      data={mockDepartmentExpenses}
                      selectedDepartment={selectedDepartment}
                      selectedPeriod={selectedPeriod}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="period" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Period Comparison</CardTitle>
                  <CardDescription>Compare payroll expenses across different time periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <PeriodComparisonChart data={mockPeriodComparison} selectedPeriod={selectedPeriod} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="category" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Categories</CardTitle>
                  <CardDescription>Breakdown of payroll expenses by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ExpenseCategoryChart data={mockExpenseCategories} selectedDepartment={selectedDepartment} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Trends</CardTitle>
                  <CardDescription>Track how payroll expenses change over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <PayrollTrendsChart data={mockPayrollTrends} selectedDepartment={selectedDepartment} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
