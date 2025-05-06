"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [company, setCompany] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const companyRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, name, email, password }),
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      setSuccess("Registration successful! Redirecting to your company portal...")
      setTimeout(() => {
        window.location.href = `https://${data.subdomain}.yourdomain.com/auth/signin`
      }, 1800)
    } else {
      const data = await res.json()
      setError(data.message || "Registration failed")
      // Focus first error field
      if (!company && companyRef.current) companyRef.current.focus()
      else if (!name && nameRef.current) nameRef.current.focus()
      else if (!email && emailRef.current) emailRef.current.focus()
      else if (!password && passwordRef.current) passwordRef.current.focus()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        aria-live="polite"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register Your Company</h1>
        {error && <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded" role="alert">{error}</div>}
        {success && <div className="mb-4 bg-green-100 text-green-700 px-4 py-2 rounded" role="status">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Company Name</label>
          <input
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            ref={companyRef}
          />
        </div>
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
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            ref={emailRef}
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
          disabled={loading}
        >
          {loading ? <span className="loader mr-2" aria-label="Loading" /> : null}
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="mt-4 text-xs text-gray-500 text-center">
          After registration, your company will be assigned a unique subdomain for login.<br/>
          (Subdomain assignment coming soon!)
        </p>
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