"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

// Mock social security data
const mockSocialSecurityData = {
  enabled: true,
  employeeContributionRate: 6.2,
  employerContributionRate: 6.2,
  maxAnnualContribution: 142800,
  medicareEmployeeRate: 1.45,
  medicareEmployerRate: 1.45,
  additionalMedicareThreshold: 200000,
  additionalMedicareRate: 0.9,
}

export function SocialSecurityForm() {
  const [socialSecurityData, setSocialSecurityData] = useState(mockSocialSecurityData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialSecurityData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (name: string, value: string) => {
    setSocialSecurityData((prev) => ({ ...prev, [name]: value === "" ? 0 : Number(value) }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSocialSecurityData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would save the social security data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification would go here
    } catch (error) {
      console.error("Error saving social security settings:", error)
      // Error notification would go here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between space-x-2 pb-4 border-b">
        <div>
          <h3 className="text-lg font-medium">Social Security Contributions</h3>
          <p className="text-sm text-gray-500">Configure social security contribution rates and thresholds</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="enabled"
            checked={socialSecurityData.enabled}
            onCheckedChange={(checked) => handleSwitchChange("enabled", checked)}
          />
          <Label htmlFor="enabled" className="cursor-pointer">
            Enabled
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Social Security</h4>

          <div className="space-y-2">
            <Label htmlFor="employeeContributionRate">Employee Contribution Rate (%)</Label>
            <Input
              id="employeeContributionRate"
              name="employeeContributionRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={socialSecurityData.employeeContributionRate}
              onChange={(e) => handleNumberInputChange("employeeContributionRate", e.target.value)}
              disabled={!socialSecurityData.enabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerContributionRate">Employer Contribution Rate (%)</Label>
            <Input
              id="employerContributionRate"
              name="employerContributionRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={socialSecurityData.employerContributionRate}
              onChange={(e) => handleNumberInputChange("employerContributionRate", e.target.value)}
              disabled={!socialSecurityData.enabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAnnualContribution">Maximum Annual Contribution</Label>
            <Input
              id="maxAnnualContribution"
              name="maxAnnualContribution"
              type="number"
              min="0"
              value={socialSecurityData.maxAnnualContribution}
              onChange={(e) => handleNumberInputChange("maxAnnualContribution", e.target.value)}
              disabled={!socialSecurityData.enabled}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Medicare</h4>

          <div className="space-y-2">
            <Label htmlFor="medicareEmployeeRate">Medicare Employee Rate (%)</Label>
            <Input
              id="medicareEmployeeRate"
              name="medicareEmployeeRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={socialSecurityData.medicareEmployeeRate}
              onChange={(e) => handleNumberInputChange("medicareEmployeeRate", e.target.value)}
              disabled={!socialSecurityData.enabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicareEmployerRate">Medicare Employer Rate (%)</Label>
            <Input
              id="medicareEmployerRate"
              name="medicareEmployerRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={socialSecurityData.medicareEmployerRate}
              onChange={(e) => handleNumberInputChange("medicareEmployerRate", e.target.value)}
              disabled={!socialSecurityData.enabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalMedicareThreshold">Additional Medicare Threshold</Label>
            <Input
              id="additionalMedicareThreshold"
              name="additionalMedicareThreshold"
              type="number"
              min="0"
              value={socialSecurityData.additionalMedicareThreshold}
              onChange={(e) => handleNumberInputChange("additionalMedicareThreshold", e.target.value)}
              disabled={!socialSecurityData.enabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalMedicareRate">Additional Medicare Rate (%)</Label>
            <Input
              id="additionalMedicareRate"
              name="additionalMedicareRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={socialSecurityData.additionalMedicareRate}
              onChange={(e) => handleNumberInputChange("additionalMedicareRate", e.target.value)}
              disabled={!socialSecurityData.enabled}
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
        <p>
          <strong>Note:</strong> These settings should be configured according to your local social security
          regulations. Consult with a tax professional to ensure compliance with local laws.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-[#454636] hover:bg-[#5a5b47] text-white" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
