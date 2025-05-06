"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { calculateMonthlyPAYE, type TaxableIncome } from "@/utils/tax-calculator"

interface TaxCalculationPreviewProps {
  defaultCountry?: string
  defaultTaxYear?: string
}

export function TaxCalculationPreview({
  defaultCountry = "Namibia",
  defaultTaxYear = "2025",
}: TaxCalculationPreviewProps) {
  const [country, setCountry] = useState(defaultCountry)
  const [taxYear, setTaxYear] = useState(defaultTaxYear)
  const [age, setAge] = useState(30)
  const [medicalAidMembers, setMedicalAidMembers] = useState(0)

  const [earnings, setEarnings] = useState<TaxableIncome>({
    grossSalary: 25000,
    taxableAllowances: 2000,
    taxableBonus: 0,
    deductions: {
      retirement: 2500,
      medicalAid: 1500,
      other: 500,
    },
  })

  const [taxResult, setTaxResult] = useState<any>(null)

  useEffect(() => {
    const result = calculateMonthlyPAYE(earnings, country, taxYear, age, medicalAidMembers)
    setTaxResult(result)
  }, [earnings, country, taxYear, age, medicalAidMembers])

  const handleEarningsChange = (field: string, value: number) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setEarnings({
        ...earnings,
        [parent]: {
          ...earnings[parent as keyof TaxableIncome],
          [child]: value,
        },
      })
    } else {
      setEarnings({
        ...earnings,
        [field]: value,
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NA", {
      style: "currency",
      currency: "NAD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tax Calculation Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country" className="bg-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="Namibia">Namibia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxYear">Tax Year</Label>
                <Select value={taxYear} onValueChange={setTaxYear}>
                  <SelectTrigger id="taxYear" className="bg-white">
                    <SelectValue placeholder="Select tax year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalAidMembers">Medical Aid Members</Label>
                <Input
                  id="medicalAidMembers"
                  type="number"
                  min="0"
                  value={medicalAidMembers}
                  onChange={(e) => setMedicalAidMembers(Number(e.target.value))}
                />
              </div>
            </div>

            <Separator />

            <h3 className="text-sm font-medium">Monthly Earnings</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="grossSalary">Gross Salary</Label>
                <Input
                  id="grossSalary"
                  type="number"
                  min="0"
                  value={earnings.grossSalary}
                  onChange={(e) => handleEarningsChange("grossSalary", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxableAllowances">Taxable Allowances</Label>
                <Input
                  id="taxableAllowances"
                  type="number"
                  min="0"
                  value={earnings.taxableAllowances}
                  onChange={(e) => handleEarningsChange("taxableAllowances", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxableBonus">Annual Bonus (if applicable)</Label>
                <Input
                  id="taxableBonus"
                  type="number"
                  min="0"
                  value={earnings.taxableBonus}
                  onChange={(e) => handleEarningsChange("taxableBonus", Number(e.target.value))}
                />
              </div>
            </div>

            <Separator />

            <h3 className="text-sm font-medium">Monthly Deductions</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="retirement">Retirement Fund</Label>
                <Input
                  id="retirement"
                  type="number"
                  min="0"
                  value={earnings.deductions.retirement}
                  onChange={(e) => handleEarningsChange("deductions.retirement", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalAid">Medical Aid</Label>
                <Input
                  id="medicalAid"
                  type="number"
                  min="0"
                  value={earnings.deductions.medicalAid}
                  onChange={(e) => handleEarningsChange("deductions.medicalAid", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other">Other Tax-Deductible Items</Label>
                <Input
                  id="other"
                  type="number"
                  min="0"
                  value={earnings.deductions.other}
                  onChange={(e) => handleEarningsChange("deductions.other", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Right column - Results */}
          <div className="space-y-4">
            {taxResult ? (
              <>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Monthly Tax Summary</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-sm text-gray-500">Monthly Taxable Income:</div>
                    <div className="text-sm font-medium text-right">{formatCurrency(taxResult.taxableIncome)}</div>

                    <div className="text-sm text-gray-500">Tax Before Rebates:</div>
                    <div className="text-sm font-medium text-right">{formatCurrency(taxResult.taxBeforeRebates)}</div>

                    <div className="text-sm text-gray-500">Total Rebates:</div>
                    <div className="text-sm font-medium text-right">{formatCurrency(taxResult.rebates.total)}</div>

                    <div className="text-sm text-gray-500 font-medium">Monthly PAYE:</div>
                    <div className="text-sm font-bold text-right">{formatCurrency(taxResult.taxPayable)}</div>

                    <div className="text-sm text-gray-500">Effective Tax Rate:</div>
                    <div className="text-sm font-medium text-right">{taxResult.effectiveRate.toFixed(2)}%</div>
                  </div>
                </div>

                {taxResult.rebates.total > 0 && (
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Tax Rebates</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      {taxResult.rebates.primary > 0 && (
                        <>
                          <div className="text-sm text-gray-500">Primary Rebate:</div>
                          <div className="text-sm font-medium text-right">
                            {formatCurrency(taxResult.rebates.primary)}
                          </div>
                        </>
                      )}

                      {taxResult.rebates.secondary > 0 && (
                        <>
                          <div className="text-sm text-gray-500">Secondary Rebate (Age 65+):</div>
                          <div className="text-sm font-medium text-right">
                            {formatCurrency(taxResult.rebates.secondary)}
                          </div>
                        </>
                      )}

                      {taxResult.rebates.tertiary > 0 && (
                        <>
                          <div className="text-sm text-gray-500">Tertiary Rebate (Age 75+):</div>
                          <div className="text-sm font-medium text-right">
                            {formatCurrency(taxResult.rebates.tertiary)}
                          </div>
                        </>
                      )}

                      {taxResult.rebates.medicalAid > 0 && (
                        <>
                          <div className="text-sm text-gray-500">Medical Aid Credits:</div>
                          <div className="text-sm font-medium text-right">
                            {formatCurrency(taxResult.rebates.medicalAid)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tax Bracket</TableHead>
                        <TableHead className="text-right">Amount in Bracket</TableHead>
                        <TableHead className="text-right">Tax for Bracket</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taxResult.taxBrackets.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            {formatCurrency(item.bracket.fromAmount / 12)} -{" "}
                            {item.bracket.toAmount ? formatCurrency(item.bracket.toAmount / 12) : "∞"}
                            <span className="text-xs text-gray-500 block">Rate: {item.bracket.rate}%</span>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(item.amountInBracket / 12)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.taxForBracket / 12)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-yellow-50 p-4 rounded-md text-sm text-yellow-800">
                  <p>
                    <strong>Note:</strong> This is a simplified tax calculation based on the provided information.
                    Actual tax calculations may vary based on additional factors and specific tax regulations.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No tax calculation available</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
