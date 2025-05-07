"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error")
        setMessage("Missing verification token.")
        return
      }
      const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      const data = await res.json()
      if (data.success) {
        setStatus("success")
        setMessage("Your email has been verified! You can now sign in.")
      } else {
        setStatus("error")
        setMessage(data.message || "Verification failed.")
      }
    }
    verify()
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        {status === "loading" && <p>Verifying...</p>}
        {status !== "loading" && (
          <>
            <p className={status === "success" ? "text-green-600" : "text-red-600"}>{message}</p>
            {status === "success" && (
              <Link href="/auth/signin" className="mt-6 inline-block text-blue-600 hover:underline">Sign in</Link>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
} 