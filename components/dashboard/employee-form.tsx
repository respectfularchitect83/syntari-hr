"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Upload, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { AutoAddress } from "@/components/ui/auto-address"
import { formatPhoneWithCountryCode } from "@/utils/country-utils"

interface EmployeeFormProps {
  employee?: Employee
  onClose: () => void
  onSuccess?: (employee: Employee) => void
}

// Sample departments and positions
const departments = [
  "Human Resources",
  "Engineering",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "Customer Support",
  "Executive",
  "Legal",
  "Product",
  "Design",
]

const positions = {
  "Human Resources": ["HR Manager", "HR Specialist", "Recruiter", "HR Assistant"],
  Engineering: ["Engineering Director", "Senior Developer", "Software Engineer", "QA Engineer", "DevOps Engineer"],
  Marketing: ["Marketing Manager", "Marketing Specialist", "Content Writer", "SEO Specialist"],
  Sales: ["Sales Director", "Sales Manager", "Account Executive", "Sales Representative"],
  Finance: ["Finance Director", "Accountant", "Financial Analyst", "Payroll Specialist"],
  Operations: ["Operations Manager", "Operations Analyst", "Project Manager"],
  "Customer Support": ["Support Manager", "Customer Support Specialist", "Technical Support"],
  Executive: ["CEO", "CTO", "CFO", "COO", "CHRO"],
  Legal: ["Legal Counsel", "Compliance Officer", "Legal Assistant"],
  Product: ["Product Manager", "Product Owner", "Business Analyst"],
  Design: ["Design Lead", "UI Designer", "UX Designer", "Graphic Designer"],
}

// Limited countries list
const countries = ["South Africa", "Namibia"]

export function EmployeeForm({ employee, onClose, onSuccess }: EmployeeFormProps) {
  const isEditMode = !!employee
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(employee?.photo || null)
  const [selectedDepartment, setSelectedDepartment] = useState(employee?.department || "")
  const [availablePositions, setAvailablePositions] = useState<string[]>([])
  const [formData, setFormData] = useState({
    id: employee?.id || crypto.randomUUID(),
    firstName: employee?.name ? employee.name.split(" ")[0] : "",
    lastName: employee?.name ? employee.name.split(" ").slice(1).join(" ") : "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    department: employee?.department || "",
    position: employee?.position || "",
    birthday: employee?.birthday || "",
    idPassport: "",
    hireDate: employee?.hireDate || "",
    manager: employee?.manager || "",
    status: employee?.status || "Active",
    workSchedule: employee?.workSchedule || "monday-friday",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "South Africa", // Default to South Africa
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    bankName: "",
    accountNumber: "",
    routingSwiftNumber: "",
    socialSecurityNumber: "",
    taxId: "",
    isRemote: false,
    notes: "",
  })

  // Update available positions when department changes
  useEffect(() => {
    if (selectedDepartment && selectedDepartment in positions) {
      setAvailablePositions(positions[selectedDepartment as keyof typeof positions])
    } else {
      setAvailablePositions([])
    }
  }, [selectedDepartment])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    // Format phone with country code when phone is changed
    setFormData((prev) => ({
      ...prev,
      phone: formatPhoneWithCountryCode(value, prev.country),
    }))
  }

  const handleEmergencyPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    // Format emergency contact phone with country code
    setFormData((prev) => ({
      ...prev,
      emergencyContactPhone: formatPhoneWithCountryCode(value, prev.country),
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "country") {
      // When country changes, format the phone numbers with the new country code
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        phone: formatPhoneWithCountryCode(prev.phone, value),
        emergencyContactPhone: formatPhoneWithCountryCode(prev.emergencyContactPhone, value),
      }))
    } else if (name === "department") {
      setSelectedDepartment(value)
      setFormData((prev) => ({ ...prev, [name]: value, position: "" }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddressSelect = (address: {
    street: string
    suburb: string
    city: string
    province: string
    postalCode: string
  }) => {
    setFormData((prev) => ({
      ...prev,
      address: address.street,
      city: address.city,
      state: address.province,
      zipCode: address.postalCode,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would upload the photo to storage and get a URL
      // For now, we'll just use the existing photo or a placeholder
      const photoUrl = photoPreview || `/placeholder.svg?height=200&width=200&query=person`

      // Prepare the employee data
      const employeeData: any = {
        ...formData,
        photo: photoUrl,
        // Remove name, as Employee model uses firstName/lastName
      }
      // Remove any fields not in the Employee model
      delete employeeData.name
      // Convert birthday and hireDate to Date if not empty
      if (employeeData.birthday) employeeData.birthday = new Date(employeeData.birthday)
      if (employeeData.hireDate) employeeData.hireDate = new Date(employeeData.hireDate)

      let res
      if (isEditMode) {
        res = await fetch("/api/employees", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        })
      } else {
        res = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        })
      }
      if (!res.ok) throw new Error("Failed to save employee")
      const saved = await res.json()
      if (onSuccess) onSuccess(saved)
      onClose()
    } catch (error) {
      console.error("Error saving employee:", error)
      // In a real app, you would show an error message
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{isEditMode ? "Edit Employee" : "Add New Employee"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 relative">
                    {photoPreview ? (
                      <Image
                        src={photoPreview || "/placeholder.svg"}
                        alt="Employee photo"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => document.getElementById("photo-upload")?.click()}
                    >
                      <Upload size={14} />
                      Upload
                    </Button>
                    {photoPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-500 hover:text-red-600"
                        onClick={removePhoto}
                      >
                        <Trash2 size={14} />
                        Remove
                      </Button>
                    )}
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handlePhoneChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      placeholder="e.g., May 15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idPassport">ID/Passport</Label>
                    <Input id="idPassport" name="idPassport" value={formData.idPassport} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <AutoAddress country={formData.country} onAddressSelect={handleAddressSelect} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Province/State</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Postal Code</Label>
                  <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                    <SelectTrigger id="country" className="bg-white">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Employment Tab */}
            <TabsContent value="employment" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                    required
                  >
                    <SelectTrigger id="department" className="bg-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => handleSelectChange("position", value)}
                    disabled={!selectedDepartment}
                    required
                  >
                    <SelectTrigger id="position" className="bg-white">
                      <SelectValue placeholder={selectedDepartment ? "Select position" : "Select department first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePositions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date *</Label>
                  <Input
                    id="hireDate"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    placeholder="e.g., Jan 10, 2023"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  <Input id="manager" name="manager" value={formData.manager} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status" className="bg-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between space-x-2 pt-6">
                  <Label htmlFor="isRemote" className="cursor-pointer">
                    Remote Employee
                  </Label>
                  <Switch
                    id="isRemote"
                    checked={formData.isRemote}
                    onCheckedChange={(checked) => handleSwitchChange("isRemote", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workSchedule">Work Schedule</Label>
                  <Select
                    value={formData.workSchedule}
                    onValueChange={(value) => handleSelectChange("workSchedule", value)}
                  >
                    <SelectTrigger id="workSchedule" className="bg-white">
                      <SelectValue placeholder="Select work schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday-friday">Monday to Friday</SelectItem>
                      <SelectItem value="monday-saturday">Monday to Saturday</SelectItem>
                      <SelectItem value="monday-sunday">Monday to Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            {/* Emergency Contact Tab */}
            <TabsContent value="emergency" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                  <Input
                    id="emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                  <Input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleEmergencyPhoneChange}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Payroll Tab */}
            <TabsContent value="payroll" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" name="bankName" value={formData.bankName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingSwiftNumber">Routing/Swift Number</Label>
                  <Input
                    id="routingSwiftNumber"
                    name="routingSwiftNumber"
                    value={formData.routingSwiftNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialSecurityNumber">Social Security Number</Label>
                  <Input
                    id="socialSecurityNumber"
                    name="socialSecurityNumber"
                    value={formData.socialSecurityNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input id="taxId" name="taxId" value={formData.taxId} onChange={handleInputChange} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#454636] hover:bg-[#5a5b47] text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update Employee" : "Create Employee"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
