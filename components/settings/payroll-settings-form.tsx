"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Mock data for earnings types
const mockEarningsTypes = [
  { id: "1", name: "Basic Salary", description: "Regular monthly salary", taxable: true, active: true },
  { id: "2", name: "Travel Allowance", description: "Monthly travel allowance", taxable: true, active: true },
  { id: "3", name: "Housing Allowance", description: "Housing subsidy", taxable: true, active: true },
  { id: "4", name: "Performance Bonus", description: "Performance-based bonus", taxable: true, active: true },
  { id: "5", name: "Cell Phone Allowance", description: "Cell phone subsidy", taxable: true, active: true },
]

// Mock data for deduction types
const mockDeductionTypes = [
  { id: "1", name: "Income Tax", description: "Statutory income tax", statutory: true, active: true },
  { id: "2", name: "Pension Fund", description: "Company pension fund contribution", statutory: false, active: true },
  { id: "3", name: "Medical Aid", description: "Medical insurance contribution", statutory: false, active: true },
  { id: "4", name: "Social Security", description: "Social security contribution", statutory: true, active: true },
  { id: "5", name: "Union Fees", description: "Labor union membership fees", statutory: false, active: true },
]

// Mock data for work schedules
const mockWorkSchedules = [
  {
    id: "1",
    name: "Monday to Friday",
    code: "monday-friday",
    hoursPerMonth: 180,
    hoursPerDay: 9,
    daysPerWeek: 5,
    active: true,
  },
  {
    id: "2",
    name: "Monday to Saturday",
    code: "monday-saturday",
    hoursPerMonth: 216,
    hoursPerDay: 9,
    daysPerWeek: 6,
    active: true,
  },
  {
    id: "3",
    name: "Monday to Sunday",
    code: "monday-sunday",
    hoursPerMonth: 252,
    hoursPerDay: 9,
    daysPerWeek: 7,
    active: true,
  },
]

// Mock data for overtime rates
const mockOvertimeRates = {
  weekdayMultiplier: 1.5,
  weekendMultiplier: 2.0,
  holidayMultiplier: 2.0,
  country: "Namibia",
}

export function PayrollSettingsForm() {
  const [activeTab, setActiveTab] = useState("earnings")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [earningsTypes, setEarningsTypes] = useState(mockEarningsTypes)
  const [deductionTypes, setDeductionTypes] = useState(mockDeductionTypes)
  const [workSchedules, setWorkSchedules] = useState(mockWorkSchedules)
  const [overtimeRates, setOvertimeRates] = useState(mockOvertimeRates)
  const [paymentMethod, setPaymentMethod] = useState("monthly")

  // New item states
  const [newEarningName, setNewEarningName] = useState("")
  const [newEarningDescription, setNewEarningDescription] = useState("")
  const [newEarningTaxable, setNewEarningTaxable] = useState(true)

  const [newDeductionName, setNewDeductionName] = useState("")
  const [newDeductionDescription, setNewDeductionDescription] = useState("")
  const [newDeductionStatutory, setNewDeductionStatutory] = useState(false)

  const [newScheduleName, setNewScheduleName] = useState("")
  const [newScheduleCode, setNewScheduleCode] = useState("")
  const [newScheduleHoursPerMonth, setNewScheduleHoursPerMonth] = useState(180)
  const [newScheduleHoursPerDay, setNewScheduleHoursPerDay] = useState(9)
  const [newScheduleDaysPerWeek, setNewScheduleDaysPerWeek] = useState(5)

  const handleAddEarning = () => {
    if (newEarningName.trim() === "") return

    const newEarning = {
      id: crypto.randomUUID(),
      name: newEarningName,
      description: newEarningDescription,
      taxable: newEarningTaxable,
      active: true,
    }

    setEarningsTypes([...earningsTypes, newEarning])
    setNewEarningName("")
    setNewEarningDescription("")
    setNewEarningTaxable(true)
  }

  const handleRemoveEarning = (id: string) => {
    setEarningsTypes(earningsTypes.filter((item) => item.id !== id))
  }

  const handleAddDeduction = () => {
    if (newDeductionName.trim() === "") return

    const newDeduction = {
      id: crypto.randomUUID(),
      name: newDeductionName,
      description: newDeductionDescription,
      statutory: newDeductionStatutory,
      active: true,
    }

    setDeductionTypes([...deductionTypes, newDeduction])
    setNewDeductionName("")
    setNewDeductionDescription("")
    setNewDeductionStatutory(false)
  }

  const handleRemoveDeduction = (id: string) => {
    setDeductionTypes(deductionTypes.filter((item) => item.id !== id))
  }

  const handleAddWorkSchedule = () => {
    if (newScheduleName.trim() === "" || newScheduleCode.trim() === "") return

    const newSchedule = {
      id: crypto.randomUUID(),
      name: newScheduleName,
      code: newScheduleCode,
      hoursPerMonth: newScheduleHoursPerMonth,
      hoursPerDay: newScheduleHoursPerDay,
      daysPerWeek: newScheduleDaysPerWeek,
      active: true,
    }

    setWorkSchedules([...workSchedules, newSchedule])
    setNewScheduleName("")
    setNewScheduleCode("")
    setNewScheduleHoursPerMonth(180)
    setNewScheduleHoursPerDay(9)
    setNewScheduleDaysPerWeek(5)
  }

  const handleRemoveWorkSchedule = (id: string) => {
    setWorkSchedules(workSchedules.filter((item) => item.id !== id))
  }

  const handleOvertimeRateChange = (field: string, value: string | number) => {
    setOvertimeRates({
      ...overtimeRates,
      [field]: typeof value === "string" ? Number.parseFloat(value) : value,
    })
  }

  const handleToggleEarningActive = (id: string, active: boolean) => {
    setEarningsTypes(earningsTypes.map((item) => (item.id === id ? { ...item, active } : item)))
  }

  const handleToggleDeductionActive = (id: string, active: boolean) => {
    setDeductionTypes(deductionTypes.map((item) => (item.id === id ? { ...item, active } : item)))
  }

  const handleToggleWorkScheduleActive = (id: string, active: boolean) => {
    setWorkSchedules(workSchedules.map((item) => (item.id === id ? { ...item, active } : item)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would save the settings to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification would go here
    } catch (error) {
      console.error("Error saving payroll settings:", error)
      // Error notification would go here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payroll Configuration</h3>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Default Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger id="paymentMethod" className="bg-white">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly Salary + Overtime</SelectItem>
              <SelectItem value="hourly">Hourly Rate</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            This setting determines the default payment method for new employees. You can override this setting for
            individual employees.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="earnings">Earnings Types</TabsTrigger>
            <TabsTrigger value="deductions">Deduction Types</TabsTrigger>
            <TabsTrigger value="schedules">Work Schedules</TabsTrigger>
            <TabsTrigger value="overtime">Overtime Rates</TabsTrigger>
          </TabsList>

          {/* Earnings Types Tab */}
          <TabsContent value="earnings" className="space-y-4">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Taxable</TableHead>
                    <TableHead className="w-[100px]">Active</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earningsTypes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Switch
                          checked={item.taxable}
                          onCheckedChange={(checked) => {
                            setEarningsTypes(
                              earningsTypes.map((earning) =>
                                earning.id === item.id ? { ...earning, taxable: checked } : earning,
                              ),
                            )
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.active}
                          onCheckedChange={(checked) => handleToggleEarningActive(item.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveEarning(item.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {earningsTypes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        No earnings types defined.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="newEarningName">Name</Label>
                <Input
                  id="newEarningName"
                  value={newEarningName}
                  onChange={(e) => setNewEarningName(e.target.value)}
                  placeholder="e.g., Housing Allowance"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="newEarningDescription">Description</Label>
                <Input
                  id="newEarningDescription"
                  value={newEarningDescription}
                  onChange={(e) => setNewEarningDescription(e.target.value)}
                  placeholder="e.g., Monthly housing subsidy"
                />
              </div>
              <div className="flex items-end md:col-span-1">
                <Button
                  type="button"
                  className="w-full bg-[#454636] hover:bg-[#5a5b47] text-white"
                  onClick={handleAddEarning}
                  disabled={!newEarningName}
                >
                  <Plus size={16} className="mr-2" />
                  Add Earning Type
                </Button>
              </div>
              <div className="flex items-center space-x-2 md:col-span-4">
                <Label htmlFor="newEarningTaxable" className="cursor-pointer">
                  Taxable
                </Label>
                <Switch id="newEarningTaxable" checked={newEarningTaxable} onCheckedChange={setNewEarningTaxable} />
                <span className="text-sm text-gray-500 ml-2">Determines if this earning is subject to income tax</span>
              </div>
            </div>
          </TabsContent>

          {/* Deduction Types Tab */}
          <TabsContent value="deductions" className="space-y-4">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Statutory</TableHead>
                    <TableHead className="w-[100px]">Active</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deductionTypes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Switch
                          checked={item.statutory}
                          onCheckedChange={(checked) => {
                            setDeductionTypes(
                              deductionTypes.map((deduction) =>
                                deduction.id === item.id ? { ...deduction, statutory: checked } : deduction,
                              ),
                            )
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.active}
                          onCheckedChange={(checked) => handleToggleDeductionActive(item.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDeduction(item.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {deductionTypes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        No deduction types defined.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="newDeductionName">Name</Label>
                <Input
                  id="newDeductionName"
                  value={newDeductionName}
                  onChange={(e) => setNewDeductionName(e.target.value)}
                  placeholder="e.g., Medical Aid"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="newDeductionDescription">Description</Label>
                <Input
                  id="newDeductionDescription"
                  value={newDeductionDescription}
                  onChange={(e) => setNewDeductionDescription(e.target.value)}
                  placeholder="e.g., Medical insurance contribution"
                />
              </div>
              <div className="flex items-end md:col-span-1">
                <Button
                  type="button"
                  className="w-full bg-[#454636] hover:bg-[#5a5b47] text-white"
                  onClick={handleAddDeduction}
                  disabled={!newDeductionName}
                >
                  <Plus size={16} className="mr-2" />
                  Add Deduction Type
                </Button>
              </div>
              <div className="flex items-center space-x-2 md:col-span-4">
                <Label htmlFor="newDeductionStatutory" className="cursor-pointer">
                  Statutory
                </Label>
                <Switch
                  id="newDeductionStatutory"
                  checked={newDeductionStatutory}
                  onCheckedChange={setNewDeductionStatutory}
                />
                <span className="text-sm text-gray-500 ml-2">Determines if this deduction is required by law</span>
              </div>
            </div>
          </TabsContent>

          {/* Work Schedules Tab */}
          <TabsContent value="schedules" className="space-y-4">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead className="w-[120px]">Hours/Month</TableHead>
                    <TableHead className="w-[120px]">Hours/Day</TableHead>
                    <TableHead className="w-[120px]">Days/Week</TableHead>
                    <TableHead className="w-[100px]">Active</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workSchedules.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.hoursPerMonth}</TableCell>
                      <TableCell>{item.hoursPerDay}</TableCell>
                      <TableCell>{item.daysPerWeek}</TableCell>
                      <TableCell>
                        <Switch
                          checked={item.active}
                          onCheckedChange={(checked) => handleToggleWorkScheduleActive(item.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveWorkSchedule(item.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {workSchedules.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        No work schedules defined.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="newScheduleName">Schedule Name</Label>
                <Input
                  id="newScheduleName"
                  value={newScheduleName}
                  onChange={(e) => setNewScheduleName(e.target.value)}
                  placeholder="e.g., Monday to Friday"
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="newScheduleCode">Code</Label>
                <Input
                  id="newScheduleCode"
                  value={newScheduleCode}
                  onChange={(e) => setNewScheduleCode(e.target.value)}
                  placeholder="e.g., mon-fri"
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="newScheduleHoursPerMonth">Hours/Month</Label>
                <Input
                  id="newScheduleHoursPerMonth"
                  type="number"
                  min="0"
                  value={newScheduleHoursPerMonth}
                  onChange={(e) => setNewScheduleHoursPerMonth(Number.parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="newScheduleHoursPerDay">Hours/Day</Label>
                <Input
                  id="newScheduleHoursPerDay"
                  type="number"
                  min="0"
                  value={newScheduleHoursPerDay}
                  onChange={(e) => setNewScheduleHoursPerDay(Number.parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="newScheduleDaysPerWeek">Days/Week</Label>
                <Input
                  id="newScheduleDaysPerWeek"
                  type="number"
                  min="1"
                  max="7"
                  value={newScheduleDaysPerWeek}
                  onChange={(e) => setNewScheduleDaysPerWeek(Number.parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-end md:col-span-6">
                <Button
                  type="button"
                  className="w-full bg-[#454636] hover:bg-[#5a5b47] text-white"
                  onClick={handleAddWorkSchedule}
                  disabled={!newScheduleName || !newScheduleCode}
                >
                  <Plus size={16} className="mr-2" />
                  Add Work Schedule
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Overtime Rates Tab */}
          <TabsContent value="overtime" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={overtimeRates.country}
                    onValueChange={(value) => handleOvertimeRateChange("country", value)}
                  >
                    <SelectTrigger id="country" className="bg-white">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Namibia">Namibia</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">Overtime rates are based on country-specific labor laws.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weekdayMultiplier">Weekday Overtime Multiplier</Label>
                  <Input
                    id="weekdayMultiplier"
                    type="number"
                    min="1"
                    step="0.1"
                    value={overtimeRates.weekdayMultiplier}
                    onChange={(e) => handleOvertimeRateChange("weekdayMultiplier", e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Multiplier for overtime hours worked on weekdays (e.g., 1.5 means 1.5x normal rate).
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weekendMultiplier">Weekend Overtime Multiplier</Label>
                  <Input
                    id="weekendMultiplier"
                    type="number"
                    min="1"
                    step="0.1"
                    value={overtimeRates.weekendMultiplier}
                    onChange={(e) => handleOvertimeRateChange("weekendMultiplier", e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Multiplier for overtime hours worked on weekends (e.g., 2.0 means 2x normal rate).
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holidayMultiplier">Public Holiday Overtime Multiplier</Label>
                  <Input
                    id="holidayMultiplier"
                    type="number"
                    min="1"
                    step="0.1"
                    value={overtimeRates.holidayMultiplier}
                    onChange={(e) => handleOvertimeRateChange("holidayMultiplier", e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Multiplier for overtime hours worked on public holidays (e.g., 2.0 means 2x normal rate).
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Overtime Calculation Examples</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Based on your current settings, here's how overtime would be calculated:
                </p>

                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium">Weekday Overtime</p>
                    <p className="text-sm text-gray-600">
                      If an employee's hourly rate is N$100, weekday overtime would be paid at
                      <span className="font-semibold"> N${100 * overtimeRates.weekdayMultiplier} per hour</span>.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium">Weekend Work</p>
                    <p className="text-sm text-gray-600">
                      If an employee's hourly rate is N$100, weekend work would be paid at
                      <span className="font-semibold"> N${100 * overtimeRates.weekendMultiplier} per hour</span>.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium">Public Holiday Work</p>
                    <p className="text-sm text-gray-600">
                      If an employee's hourly rate is N$100, work on public holidays would be paid at
                      <span className="font-semibold"> N${100 * overtimeRates.holidayMultiplier} per hour</span>.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> These calculations are based on the multipliers set for{" "}
                    {overtimeRates.country}. Make sure these align with current labor laws in your country.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Separator />

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
