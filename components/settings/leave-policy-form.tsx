"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Trash2, Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock leave policy data
const mockLeavePolicy = {
  annualLeaveEnabled: true,
  annualLeaveDays: 20,
  sickLeaveEnabled: true,
  sickLeaveDays: 10,
  maternityLeaveEnabled: true,
  maternityLeaveDays: 90,
  paternityLeaveEnabled: true,
  paternityLeaveDays: 14,
  bereavementLeaveEnabled: true,
  bereavementLeaveDays: 5,
  unpaidLeaveEnabled: true,
  carryOverEnabled: true,
  maxCarryOverDays: 5,
  carryOverExpiryMonths: 3,
  countryHolidays: "auto", // "auto" or "manual"
  publicHolidays: [
    { id: "1", name: "New Year's Day", date: "2025-01-01" },
    { id: "2", name: "Independence Day", date: "2025-07-04" },
    { id: "3", name: "Labor Day", date: "2025-09-01" },
    { id: "4", name: "Thanksgiving Day", date: "2025-11-27" },
    { id: "5", name: "Christmas Day", date: "2025-12-25" },
  ],
}

interface PublicHoliday {
  id: string
  name: string
  date: string
}

export function LeavePolicyForm() {
  const [leavePolicy, setLeavePolicy] = useState(mockLeavePolicy)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("United States")
  const [newHolidayDate, setNewHolidayDate] = useState<Date | undefined>(undefined)
  const [newHolidayName, setNewHolidayName] = useState("")

  // In a real app, you would fetch public holidays based on the selected country
  useEffect(() => {
    if (leavePolicy.countryHolidays === "auto" && selectedCountry) {
      // Simulate fetching public holidays for the selected country
      // In a real app, you would call an API to get the holidays
      const fetchPublicHolidays = async () => {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data for different countries
        const holidaysByCountry: Record<string, PublicHoliday[]> = {
          "United States": [
            { id: "1", name: "New Year's Day", date: "2025-01-01" },
            { id: "2", name: "Independence Day", date: "2025-07-04" },
            { id: "3", name: "Labor Day", date: "2025-09-01" },
            { id: "4", name: "Thanksgiving Day", date: "2025-11-27" },
            { id: "5", name: "Christmas Day", date: "2025-12-25" },
          ],
          "United Kingdom": [
            { id: "1", name: "New Year's Day", date: "2025-01-01" },
            { id: "2", name: "Good Friday", date: "2025-04-18" },
            { id: "3", name: "Easter Monday", date: "2025-04-21" },
            { id: "4", name: "Early May Bank Holiday", date: "2025-05-05" },
            { id: "5", name: "Christmas Day", date: "2025-12-25" },
            { id: "6", name: "Boxing Day", date: "2025-12-26" },
          ],
          // Add more countries as needed
        }

        const holidays = holidaysByCountry[selectedCountry] || []
        setLeavePolicy((prev) => ({ ...prev, publicHolidays: holidays }))
      }

      fetchPublicHolidays()
    }
  }, [selectedCountry, leavePolicy.countryHolidays])

  const handleInputChange = (name: string, value: any) => {
    setLeavePolicy((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (name: string, value: string) => {
    setLeavePolicy((prev) => ({ ...prev, [name]: value === "" ? 0 : Number(value) }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setLeavePolicy((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddHoliday = () => {
    if (newHolidayDate && newHolidayName) {
      const newHoliday: PublicHoliday = {
        id: crypto.randomUUID(),
        name: newHolidayName,
        date: format(newHolidayDate, "yyyy-MM-dd"),
      }

      setLeavePolicy((prev) => ({
        ...prev,
        publicHolidays: [...prev.publicHolidays, newHoliday],
      }))

      // Reset form
      setNewHolidayDate(undefined)
      setNewHolidayName("")
    }
  }

  const handleRemoveHoliday = (id: string) => {
    setLeavePolicy((prev) => ({
      ...prev,
      publicHolidays: prev.publicHolidays.filter((holiday) => holiday.id !== id),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would save the leave policy to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification would go here
    } catch (error) {
      console.error("Error saving leave policy:", error)
      // Error notification would go here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Leave Entitlements</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="annualLeaveEnabled" className="cursor-pointer">
                Annual Leave
              </Label>
              <Switch
                id="annualLeaveEnabled"
                checked={leavePolicy.annualLeaveEnabled}
                onCheckedChange={(checked) => handleSwitchChange("annualLeaveEnabled", checked)}
              />
            </div>

            {leavePolicy.annualLeaveEnabled && (
              <div className="pl-6 border-l-2 border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="annualLeaveDays">Days per year</Label>
                  <Input
                    id="annualLeaveDays"
                    type="number"
                    min="0"
                    value={leavePolicy.annualLeaveDays}
                    onChange={(e) => handleNumberInputChange("annualLeaveDays", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sickLeaveEnabled" className="cursor-pointer">
                Sick Leave
              </Label>
              <Switch
                id="sickLeaveEnabled"
                checked={leavePolicy.sickLeaveEnabled}
                onCheckedChange={(checked) => handleSwitchChange("sickLeaveEnabled", checked)}
              />
            </div>

            {leavePolicy.sickLeaveEnabled && (
              <div className="pl-6 border-l-2 border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="sickLeaveDays">Days per year</Label>
                  <Input
                    id="sickLeaveDays"
                    type="number"
                    min="0"
                    value={leavePolicy.sickLeaveDays}
                    onChange={(e) => handleNumberInputChange("sickLeaveDays", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maternityLeaveEnabled" className="cursor-pointer">
                Maternity Leave
              </Label>
              <Switch
                id="maternityLeaveEnabled"
                checked={leavePolicy.maternityLeaveEnabled}
                onCheckedChange={(checked) => handleSwitchChange("maternityLeaveEnabled", checked)}
              />
            </div>

            {leavePolicy.maternityLeaveEnabled && (
              <div className="pl-6 border-l-2 border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="maternityLeaveDays">Days</Label>
                  <Input
                    id="maternityLeaveDays"
                    type="number"
                    min="0"
                    value={leavePolicy.maternityLeaveDays}
                    onChange={(e) => handleNumberInputChange("maternityLeaveDays", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="paternityLeaveEnabled" className="cursor-pointer">
                Paternity Leave
              </Label>
              <Switch
                id="paternityLeaveEnabled"
                checked={leavePolicy.paternityLeaveEnabled}
                onCheckedChange={(checked) => handleSwitchChange("paternityLeaveEnabled", checked)}
              />
            </div>

            {leavePolicy.paternityLeaveEnabled && (
              <div className="pl-6 border-l-2 border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="paternityLeaveDays">Days</Label>
                  <Input
                    id="paternityLeaveDays"
                    type="number"
                    min="0"
                    value={leavePolicy.paternityLeaveDays}
                    onChange={(e) => handleNumberInputChange("paternityLeaveDays", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="bereavementLeaveEnabled" className="cursor-pointer">
                Bereavement Leave
              </Label>
              <Switch
                id="bereavementLeaveEnabled"
                checked={leavePolicy.bereavementLeaveEnabled}
                onCheckedChange={(checked) => handleSwitchChange("bereavementLeaveEnabled", checked)}
              />
            </div>

            {leavePolicy.bereavementLeaveEnabled && (
              <div className="pl-6 border-l-2 border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="bereavementLeaveDays">Days</Label>
                  <Input
                    id="bereavementLeaveDays"
                    type="number"
                    min="0"
                    value={leavePolicy.bereavementLeaveDays}
                    onChange={(e) => handleNumberInputChange("bereavementLeaveDays", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="unpaidLeaveEnabled" className="cursor-pointer">
                Unpaid Leave
              </Label>
              <Switch
                id="unpaidLeaveEnabled"
                checked={leavePolicy.unpaidLeaveEnabled}
                onCheckedChange={(checked) => handleSwitchChange("unpaidLeaveEnabled", checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="carryOverEnabled" className="cursor-pointer">
                Annual Leave Carry Over
              </Label>
              <Switch
                id="carryOverEnabled"
                checked={leavePolicy.carryOverEnabled}
                onCheckedChange={(checked) => handleSwitchChange("carryOverEnabled", checked)}
              />
            </div>

            {leavePolicy.carryOverEnabled && (
              <div className="pl-6 border-l-2 border-gray-200 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxCarryOverDays">Maximum days to carry over</Label>
                  <Input
                    id="maxCarryOverDays"
                    type="number"
                    min="0"
                    value={leavePolicy.maxCarryOverDays}
                    onChange={(e) => handleNumberInputChange("maxCarryOverDays", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carryOverExpiryMonths">Expiry period (months)</Label>
                  <Input
                    id="carryOverExpiryMonths"
                    type="number"
                    min="0"
                    value={leavePolicy.carryOverExpiryMonths}
                    onChange={(e) => handleNumberInputChange("carryOverExpiryMonths", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Public Holidays</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="countryHolidays">Public Holidays Source</Label>
              <Select
                value={leavePolicy.countryHolidays}
                onValueChange={(value) => handleInputChange("countryHolidays", value)}
              >
                <SelectTrigger id="countryHolidays" className="bg-white">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automatic (Based on Country)</SelectItem>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {leavePolicy.countryHolidays === "auto" && (
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger id="country" className="bg-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] bg-white">
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="Namibia">Namibia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holiday Name</TableHead>
                    <TableHead>Date</TableHead>
                    {leavePolicy.countryHolidays === "manual" && <TableHead className="w-[80px]"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leavePolicy.publicHolidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell>{holiday.name}</TableCell>
                      <TableCell>{format(new Date(holiday.date), "MMMM d, yyyy")}</TableCell>
                      {leavePolicy.countryHolidays === "manual" && (
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveHoliday(holiday.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {leavePolicy.publicHolidays.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={leavePolicy.countryHolidays === "manual" ? 3 : 2}
                        className="text-center py-4 text-gray-500"
                      >
                        No public holidays defined.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {leavePolicy.countryHolidays === "manual" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="newHolidayDate">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white",
                          !newHolidayDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newHolidayDate ? format(newHolidayDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newHolidayDate}
                        onSelect={setNewHolidayDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="newHolidayName">Holiday Name</Label>
                  <Input
                    id="newHolidayName"
                    value={newHolidayName}
                    onChange={(e) => setNewHolidayName(e.target.value)}
                    placeholder="e.g., New Year's Day"
                  />
                </div>

                <div className="flex items-end md:col-span-1">
                  <Button
                    type="button"
                    className="w-full bg-[#454636] hover:bg-[#5a5b47] text-white"
                    onClick={handleAddHoliday}
                    disabled={!newHolidayDate || !newHolidayName}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Holiday
                  </Button>
                </div>
              </div>
            )}
          </div>
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
