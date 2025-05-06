"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Lock, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CompanyLogo from "./company-logo"

export default function LoginPage() {
  const [companyName, setCompanyName] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [greeting, setGreeting] = useState<string>("Welcome")
  const router = useRouter()

  useEffect(() => {
    // Extract company name from subdomain
    const hostname = window.location.hostname
    const isLocalhost = hostname === "localhost"

    if (isLocalhost) {
      // For local development, use a default company or query param
      const urlParams = new URLSearchParams(window.location.search)
      const company = urlParams.get("company") || "demo"
      setCompanyName(company)
    } else {
      // Extract subdomain from production URL
      const subdomain = hostname.split(".")[0]
      if (subdomain !== "syntarihr" && subdomain !== "www") {
        setCompanyName(subdomain)
      } else {
        // Handle case when accessed via main domain
        setCompanyName("")
      }
    }

    // Set time-based greeting
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning")
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
  }, [])

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // This would be replaced with your actual authentication logic
      // For now, we'll simulate a login process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate validation
      if (!email || !password) {
        throw new Error("Please enter both email and password")
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-roboto">
      <div className="container px-4 py-10 mx-auto flex flex-col items-center justify-center">
        {companyName && (
          <div className="mb-8 text-center flex flex-col items-center">
            <CompanyLogo companyName={companyName} />
            <h2 className="mt-3 text-3xl font-bold text-gray-900">Company</h2>
          </div>
        )}

        <Card className="w-full max-w-md mx-auto bg-[#454636] shadow-xl border-none rounded-xl overflow-hidden">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">{greeting}</CardTitle>
            <CardDescription className="text-white/80">Sign into your HR account</CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-white">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    className="pl-10 bg-white/10 border-none text-white placeholder:text-white/50 focus:border-none shadow-inner shadow-black/20 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white text-sm">
                    Password
                  </Label>
                  <a href="#" className="text-xs text-white/80 hover:text-white">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="pl-10 bg-white/10 border-none text-white placeholder:text-white/50 focus:border-none shadow-inner shadow-black/20 rounded-lg"
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-white/20 hover:bg-white/30 text-white border-none shadow-md shadow-black/20 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-6 text-center text-gray-500 text-[0.5rem]">
          © {new Date().getFullYear()} Syntari HR. All rights reserved.
        </p>
      </div>
    </div>
  )
}
