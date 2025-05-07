"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("syntarihr_landing_pw") === "0811278404") {
        setUnlocked(true)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === "0811278404") {
      localStorage.setItem("syntarihr_landing_pw", "0811278404")
      setUnlocked(true)
      setError("")
    } else {
      setError("Incorrect password.")
    }
  }

  if (!unlocked) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Syntari HR</h1>
          <p className="mb-4 text-gray-600">This page is password protected.</p>
          <input
            type="password"
            className="border px-3 py-2 rounded w-full mb-2"
            placeholder="Enter password"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold">Unlock</button>
          {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
        </form>
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Syntari HR</h1>
        <p className="mb-6 text-gray-600">Modern HR for your organization.</p>
        <Link href="/auth/register" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold mb-2">Sign up</Link>
        <div className="mt-4">
          <span className="text-gray-500">Already have an account? </span>
          <Link href="/auth/signin" className="text-blue-600 hover:underline">Log in</Link>
        </div>
        <div className="mt-8">
          <button
            className="text-red-600 underline text-sm"
            onClick={() => {
              const pw = prompt("Enter admin password:")
              if (pw === "0811278404") {
                window.location.href = "/admin/delete-companies"
              } else if (pw !== null) {
                alert("Incorrect password.")
              }
            }}
            type="button"
          >
            Danger Zone (Admin)
          </button>
        </div>
      </div>
    </main>
  )
}
