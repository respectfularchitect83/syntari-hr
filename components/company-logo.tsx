"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { User } from "lucide-react"

interface CompanyLogoProps {
  companyName: string
}

export default function CompanyLogo({ companyName }: CompanyLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    // In a real app, you would fetch the company logo from your API
    // For now, we'll simulate this with a placeholder
    const fetchCompanyLogo = async () => {
      try {
        // This would be your actual API endpoint
        // const response = await fetch(`/api/companies/${companyName}/logo`)
        // const data = await response.json()
        // setLogoUrl(data.logoUrl)

        // For demo purposes, use a placeholder
        setLogoUrl(`/placeholder.svg?height=80&width=80&query=company%20logo%20${companyName}`)
      } catch (err) {
        console.error("Failed to load company logo", err)
        setError(true)
      }
    }

    if (companyName) {
      fetchCompanyLogo()
    }
  }, [companyName])

  if (error || !logoUrl) {
    return (
      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
        <User className="h-10 w-10 text-white" />
      </div>
    )
  }

  return (
    <div className="w-40 h-40 rounded-full overflow-hidden bg-white/20">
      <Image
        src={logoUrl || "/placeholder.svg"}
        alt={`${companyName} logo`}
        width={160}
        height={160}
        className="object-cover"
      />
    </div>
  )
}
