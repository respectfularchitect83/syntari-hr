"use client"

import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AcceptInvitePage() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const nameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    const res = await fetch("/api/invite/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name, password }),
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      setSuccess(true)
      setMessage("Account created! Redirecting to your company portal...")
      setTimeout(() => {
        window.location.href = `https://${data.subdomain}.yourdomain.com/auth/signin`
      }, 2000)
    } else {
      const data = await res.json()
      setMessage(data.message || "Failed to accept invite")
      // Focus first error field
      if (!name && nameRef.current) nameRef.current.focus()
      else if (!password && passwordRef.current) passwordRef.current.focus()
    }
  }

  if (!token) {
    return <div className="p-8 text-center text-red-600">Invalid invite link.</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        aria-live="polite"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Accept Your Invite</h1>
        {message && <div className={`mb-4 text-center ${success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-4 py-2 rounded`} role={success ? "status" : "alert"}>{message}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            ref={nameRef}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            ref={passwordRef}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition flex items-center justify-center"
          disabled={loading || success}
        >
          {loading ? <span className="loader mr-2" aria-label="Loading" /> : null}
          {loading ? "Creating account..." : "Accept Invite"}
        </button>
      </form>
      <style jsx>{`
        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 