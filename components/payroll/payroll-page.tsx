"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PayrollRunsTable } from "./payroll-runs-table"
import { PayrollEmployeesTable } from "./payroll-employees-table"
import { Button } from "@/components/ui/button"
import { Plus, Calculator, BarChart } from "lucide-react"
import { NewPayrollRunDialog } from "./new-payroll-run-dialog"
import { TaxCalculationPreview } from "./tax-calculation-preview"
import Link from "next/link"

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState("runs")
  const [showNewRunDialog, setShowNewRunDialog] = useState(false)
  const [showTaxCalculator, setShowTaxCalculator] = useState(false)

  return (
    <DashboardLayout>
      <div className="p-6 pt-0">
        <div className="flex justify-between items-center pt-[4.5rem] pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTaxCalculator(!showTaxCalculator)}
              className="flex items-center gap-1"
            >
              <Calculator size={16} className="mr-1" />
              Tax Calculator
            </Button>
            <Link href="/payroll/reports">
              <Button variant="outline" className="flex items-center gap-1">
                <BarChart size={16} className="mr-1" />
                Reports
              </Button>
            </Link>
            <Button onClick={() => setShowNewRunDialog(true)} className="bg-[#454636] hover:bg-[#5a5b47] text-white">
              <Plus size={16} className="mr-2" />
              New Payroll Run
            </Button>
          </div>
        </div>

        {showTaxCalculator && (
          <div className="mb-6">
            <TaxCalculationPreview />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
              <TabsTrigger value="employees">Employee Payroll</TabsTrigger>
            </TabsList>

            <TabsContent value="runs" className="mt-0">
              <PayrollRunsTable />
            </TabsContent>

            <TabsContent value="employees" className="mt-0">
              <PayrollEmployeesTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showNewRunDialog && <NewPayrollRunDialog open={showNewRunDialog} onClose={() => setShowNewRunDialog(false)} />}
    </DashboardLayout>
  )
}
