"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"
// Define limited countries
const countries = ["South Africa", "Namibia"]
import { AutoAddress } from "@/components/ui/auto-address"
import { formatPhoneWithCountryCode } from "@/utils/country-utils"

// Mock company data
const mockCompanyData = {
  name: "Acme Corporation",
  legalName: "Acme Corp. Ltd.",
  taxId: "123456789",
  registrationNumber: "REG123456",
  address: "123 Business Avenue",
  city: "Metropolis",
  state: "State",
  zipCode: "12345",
  country: "South Africa",
  phone: "+27 123 4567",
  email: "info@acmecorp.com",
  website: "https://www.acmecorp.com",
  description: "A leading provider of innovative solutions.",
  logo: "/default-organisation.png",
}

export function CompanyDetailsForm() {
  const [companyData, setCompanyData] = useState(mockCompanyData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(mockCompanyData.logo)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompanyData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressSelect = (address: {
    street: string
    suburb: string
    city: string
    province: string
    postalCode: string
  }) => {
    setCompanyData((prev) => ({
      ...prev,
      address: address.street,
      city: address.city,
      state: address.province,
      zipCode: address.postalCode,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "country") {
      // When country changes, format the phone number with the new country code
      setCompanyData((prev) => ({
        ...prev,
        [name]: value,
        phone: formatPhoneWithCountryCode(prev.phone, value),
      }))
    } else {
      setCompanyData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    // Format phone with country code when phone is changed
    setCompanyData((prev) => ({
      ...prev,
      phone: formatPhoneWithCountryCode(value, prev.country),
    }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would save the company data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification would go here
    } catch (error) {
      console.error("Error saving company details:", error)
      // Error notification would go here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center space-y-4 md:w-1/3">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 relative">
            {logoPreview ? (
              <Image
                src={logoPreview || "/placeholder.svg"}
                alt="Company logo"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">No Logo</div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => document.getElementById("logo-upload")?.click()}
          >
            <Upload size={16} />
            Upload Logo
          </Button>
          <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input id="name" name="name" value={companyData.name} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalName">Legal Name *</Label>
            <Input
              id="legalName"
              name="legalName"
              value={companyData.legalName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID *</Label>
            <Input id="taxId" name="taxId" value={companyData.taxId} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              value={companyData.registrationNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <AutoAddress country={companyData.country} onAddressSelect={handleAddressSelect} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input id="address" name="address" value={companyData.address} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input id="city" name="city" value={companyData.city} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Province/State *</Label>
          <Input id="state" name="state" value={companyData.state} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Postal Code *</Label>
          <Input id="zipCode" name="zipCode" value={companyData.zipCode} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select value={companyData.country} onValueChange={(value) => handleSelectChange("country", value)} required>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" name="phone" value={companyData.phone} onChange={handlePhoneChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" value={companyData.email} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" value={companyData.website} onChange={handleInputChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          name="description"
          value={companyData.description}
          onChange={handleInputChange}
          className="min-h-[100px]"
        />
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
