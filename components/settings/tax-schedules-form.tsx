"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"

// Mock tax brackets
const mockTaxBrackets = [
  { id: "1", fromAmount: 0, toAmount: 10000, rate: 10, baseAmount: 0, description: "Low income" },
  { id: "2", fromAmount: 10001, toAmount: 50000, rate: 15, baseAmount: 1000, description: "Middle income" },
  { id: "3", fromAmount: 50001, toAmount: 100000, rate: 25, baseAmount: 7000, description: "High income" },
  { id: "4", fromAmount: 100001, toAmount: null, rate: 35, baseAmount: 19500, description: "Top bracket" },
]

interface TaxBracket {
  id: string
  fromAmount: number
  toAmount: number | null
  rate: number
  baseAmount: number
  description: string
}

interface TaxRebates {
  primary: number
  secondary: number
  tertiary: number
  medicalAid: number
}

export function TaxSchedulesForm() {
  const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>(mockTaxBrackets)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rebates, setRebates] = useState<TaxRebates>({
    primary: 17235,
    secondary: 9444,
    tertiary: 3145,
    medicalAid: 347,
  })

  const handleAddBracket = () => {
    const newBracket: TaxBracket = {
      id: crypto.randomUUID(),
      fromAmount: 0,
      toAmount: null,
      rate: 0,
      baseAmount: 0,
      description: "",
    }
    setTaxBrackets([...taxBrackets, newBracket])
  }

  const handleRemoveBracket = (id: string) => {
    setTaxBrackets(taxBrackets.filter((bracket) => bracket.id !== id))
  }

  const handleBracketChange = (id: string, field: keyof TaxBracket, value: any) => {
    setTaxBrackets(
      taxBrackets.map((bracket) => {
        if (bracket.id === id) {
          return { ...bracket, [field]: value }
        }
        return bracket
      }),
    )
  }

  const handleRebateChange = (field: keyof TaxRebates, value: number) => {
    setRebates({
      ...rebates,
      [field]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would save the tax brackets to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification would go here
    } catch (error) {
      console.error("Error saving tax schedules:", error)
      // Error notification would go here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Income Tax Brackets</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleAddBracket}
          >
            <Plus size={16} />
            Add Bracket
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From Amount</TableHead>
                <TableHead>To Amount</TableHead>
                <TableHead>Rate (%)</TableHead>
                <TableHead>Base Rate (amount)</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxBrackets.map((bracket) => (
                <TableRow key={bracket.id}>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={bracket.fromAmount}
                      onChange={(e) => handleBracketChange(bracket.id, "fromAmount", Number(e.target.value))}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={bracket.toAmount === null ? "" : bracket.toAmount}
                      onChange={(e) =>
                        handleBracketChange(
                          bracket.id,
                          "toAmount",
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                      placeholder="No limit"
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={bracket.rate}
                      onChange={(e) => handleBracketChange(bracket.id, "rate", Number(e.target.value))}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={bracket.baseAmount}
                      onChange={(e) => handleBracketChange(bracket.id, "baseAmount", Number(e.target.value))}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={bracket.description}
                      onChange={(e) => handleBracketChange(bracket.id, "description", e.target.value)}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBracket(bracket.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {taxBrackets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No tax brackets defined. Click "Add Bracket" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
          <p>
            <strong>Note:</strong> Tax brackets should be configured according to your local tax regulations. Ensure
            that brackets do not overlap and cover the entire income range. The Base Rate is the fixed amount to be paid
            for income in this bracket, in addition to the percentage rate.
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-medium">Tax Rebates</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md bg-gray-50">
          <div className="space-y-2">
            <Label htmlFor="primaryRebate">Primary Rebate</Label>
            <Input
              id="primaryRebate"
              type="number"
              min="0"
              step="0.01"
              value={rebates.primary}
              onChange={(e) => handleRebateChange("primary", Number(e.target.value))}
              className="bg-white"
            />
            <p className="text-xs text-gray-500">For all taxpayers</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryRebate">Secondary Rebate</Label>
            <Input
              id="secondaryRebate"
              type="number"
              min="0"
              step="0.01"
              value={rebates.secondary}
              onChange={(e) => handleRebateChange("secondary", Number(e.target.value))}
              className="bg-white"
            />
            <p className="text-xs text-gray-500">For taxpayers 65 and older</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tertiaryRebate">Tertiary Rebate</Label>
            <Input
              id="tertiaryRebate"
              type="number"
              min="0"
              step="0.01"
              value={rebates.tertiary}
              onChange={(e) => handleRebateChange("tertiary", Number(e.target.value))}
              className="bg-white"
            />
            <p className="text-xs text-gray-500">For taxpayers 75 and older</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicalAidRebate">Medical Aid Rebate</Label>
            <Input
              id="medicalAidRebate"
              type="number"
              min="0"
              step="0.01"
              value={rebates.medicalAid}
              onChange={(e) => handleRebateChange("medicalAid", Number(e.target.value))}
              className="bg-white"
            />
            <p className="text-xs text-gray-500">Per medical aid member</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
          <p>
            <strong>Note:</strong> Tax rebates reduce the amount of tax payable. The primary rebate applies to all
            taxpayers, while the secondary and tertiary rebates are age-related. The medical aid rebate is applied per
            member on a medical aid scheme.
          </p>
        </div>
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
