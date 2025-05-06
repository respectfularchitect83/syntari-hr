"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

interface NewPayrollRunDialogProps {
  open: boolean
  onClose: () => void
}

export function NewPayrollRunDialog({ open, onClose }: NewPayrollRunDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [payrollPeriod, setPayrollPeriod] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [paymentDate, setPaymentDate] = useState("")

  // Generate options for payroll periods (last 12 months and next 3 months)
  const generatePayrollPeriods = () => {
    const periods = []
    const today = new Date()

    // Past 12 months
    for (let i = -12; i <= 3; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1)
      const periodName = format(date, "MMMM yyyy")
      const periodValue = format(date, "yyyy-MM")

      periods.push({ name: periodName, value: periodValue })
    }

    return periods
  }

  const payrollPeriods = generatePayrollPeriods()

  const handlePeriodChange = (period: string) => {
    setPayrollPeriod(period)

    // Set start and end dates based on selected period
    const [year, month] = period.split("-").map(Number)
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0) // Last day of the month

    setStartDate(format(startDate, "yyyy-MM-dd"))
    setEndDate(format(endDate, "yyyy-MM-dd"))

    // Set default payment date (last day of the month)
    setPaymentDate(format(endDate, "yyyy-MM-dd"))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, you would create a new payroll run
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification would go here
      onClose()
    } catch (error) {
      console.error("Error creating payroll run:", error)
      // Error notification would go here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Payroll Run</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="payrollPeriod">Payroll Period</Label>
            <Select value={payrollPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger id="payrollPeriod" className="bg-white">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {payrollPeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input id="paymentDate" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-[#454636] hover:bg-[#5a5b47] text-white"
            onClick={handleSubmit}
            disabled={isSubmitting || !payrollPeriod || !startDate || !endDate || !paymentDate}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Payroll Run"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
