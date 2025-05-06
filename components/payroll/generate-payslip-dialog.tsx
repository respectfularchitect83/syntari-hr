"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Mail, FileDown, Eye } from "lucide-react"
import { generatePayslip } from "@/actions/payslip-actions"
import { PayslipPreviewDialog } from "./payslip-preview-dialog"
import { TaxCalculationPreview } from "./tax-calculation-preview"
import { useToast } from "@/hooks/use-toast"

interface GeneratePayslipDialogProps {
  open: boolean
  onClose: () => void
  payrollRunId: string
  employeeId: string
}

export function GeneratePayslipDialog({ open, onClose, payrollRunId, employeeId }: GeneratePayslipDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState("options")

  // Options state
  const [sendEmail, setSendEmail] = useState(true)
  const [includeYTD, setIncludeYTD] = useState(true)
  const [includeLeaveBalance, setIncludeLeaveBalance] = useState(true)
  const [passwordProtect, setPasswordProtect] = useState(false)

  const handleGeneratePayslip = async () => {
    setIsSubmitting(true)

    try {
      const result = await generatePayslip({
        employeeId,
        payrollRunId,
        sendEmail,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        onClose()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Generate Payslip</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="tax">Tax Calculation</TabsTrigger>
            </TabsList>

            <TabsContent value="options" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sendEmail" checked={sendEmail} onCheckedChange={(checked) => setSendEmail(!!checked)} />
                  <Label htmlFor="sendEmail" className="cursor-pointer">
                    Send payslip via email
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeYTD"
                    checked={includeYTD}
                    onCheckedChange={(checked) => setIncludeYTD(!!checked)}
                  />
                  <Label htmlFor="includeYTD" className="cursor-pointer">
                    Include year-to-date totals
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeLeaveBalance"
                    checked={includeLeaveBalance}
                    onCheckedChange={(checked) => setIncludeLeaveBalance(!!checked)}
                  />
                  <Label htmlFor="includeLeaveBalance" className="cursor-pointer">
                    Include leave balance
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="passwordProtect"
                    checked={passwordProtect}
                    onCheckedChange={(checked) => setPasswordProtect(!!checked)}
                  />
                  <Label htmlFor="passwordProtect" className="cursor-pointer">
                    Password protect PDF
                  </Label>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Payslip Information</h3>
                <p className="text-sm text-blue-700">
                  The payslip will include detailed earnings and deductions, including automatically calculated tax
                  based on the current tax brackets for the employee's country.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="tax">
              <TaxCalculationPreview />
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handlePreview} disabled={isSubmitting} className="w-full sm:w-auto">
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Download Started",
                  description: "Your payslip is being downloaded.",
                })
              }}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <FileDown size={16} className="mr-2" />
              Download
            </Button>
            <Button
              onClick={handleGeneratePayslip}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#454636] hover:bg-[#5a5b47] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {sendEmail ? <Mail size={16} className="mr-2" /> : <FileDown size={16} className="mr-2" />}
                  {sendEmail ? "Generate & Email" : "Generate"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showPreview && (
        <PayslipPreviewDialog
          open={showPreview}
          onClose={() => setShowPreview(false)}
          employeeId={employeeId}
          payrollRunId={payrollRunId}
          options={{
            includeYTD,
            includeLeaveBalance,
          }}
        />
      )}
    </>
  )
}
