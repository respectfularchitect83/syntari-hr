"use client"

import { useEffect, useState, useRef } from "react"
import { Session } from "next-auth"

interface User {
  id: string
  name: string
  email: string
  role: string
  active: boolean
}

interface Invite {
  id: string
  email: string
  role: string
  status: string
  createdAt: string
  expiresAt: string
}

export default function TeamManagement({ session, org }: { session: Session, org?: any }) {
  const [users, setUsers] = useState<User[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("STANDARD")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [message, setMessage] = useState("")
  const toastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      setFetching(true)
      setFetchError("")
      try {
        const orgId = session.user.organizationId
        const usersRes = await fetch(`/api/org/${orgId}/users`)
        const invitesRes = await fetch(`/api/org/${orgId}/invites`)
        if (!usersRes.ok || !invitesRes.ok) throw new Error("Failed to fetch team data")
        setUsers(await usersRes.json())
        setInvites(await invitesRes.json())
      } catch (err: any) {
        setFetchError(err.message || "Failed to fetch team data")
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [session.user.organizationId])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        role,
        organizationId: session.user.organizationId,
        invitedBy: session.user.id,
      }),
    })
    setLoading(false)
    if (res.ok) {
      setMessage("Invite sent!")
      setEmail("")
      setRole("STANDARD")
      setTimeout(() => setMessage(""), 2000)
    } else {
      const data = await res.json()
      setMessage(data.message || "Failed to send invite")
      setTimeout(() => setMessage(""), 3000)
    }
    if (toastRef.current) toastRef.current.focus()
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {org && (
        <div className="mb-4 text-center text-gray-700">
          <span className="font-bold">Organization:</span> {org.name} (<span className="text-blue-700">{org.subdomain}</span>)
        </div>
      )}
      {fetchError && <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded" role="alert">{fetchError}</div>}
      {fetching ? (
        <div className="text-center py-8"><span className="loader" aria-label="Loading" /></div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Team Members</h2>
          {users.length === 0 ? (
            <div className="mb-6 text-gray-500">No team members yet.</div>
          ) : (
            <ul className="mb-6">
              {users.map((user) => (
                <li key={user.id} className="mb-2 flex justify-between items-center">
                  <span>{user.name} ({user.email}) - {user.role}</span>
                  <span className={user.active ? "text-green-600" : "text-gray-400"}>{user.active ? "Active" : "Inactive"}</span>
                </li>
              ))}
            </ul>
          )}
          <h2 className="text-xl font-bold mb-4">Pending Invites</h2>
          {invites.length === 0 ? (
            <div className="mb-6 text-gray-500">No pending invites.</div>
          ) : (
            <ul className="mb-6">
              {invites.map((invite) => (
                <li key={invite.id} className="mb-2 flex justify-between items-center">
                  <span>{invite.email} - {invite.role}</span>
                  <span className="text-yellow-600">{invite.status}</span>
                </li>
              ))}
            </ul>
          )}
          <h2 className="text-xl font-bold mb-2">Invite a New User</h2>
          <form onSubmit={handleInvite} className="flex gap-2 mb-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="border rounded px-2 py-1 flex-1"
              required
            />
            <select value={role} onChange={e => setRole(e.target.value)} className="border rounded px-2 py-1">
              <option value="STANDARD">Standard</option>
              <option value="ADMIN">Admin</option>
              <option value="HR_MANAGER">HR Manager</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded flex items-center justify-center" disabled={loading}>
              {loading ? <span className="loader mr-2" aria-label="Loading" /> : null}
              {loading ? "Inviting..." : "Invite"}
            </button>
          </form>
          <div
            ref={toastRef}
            tabIndex={-1}
            aria-live="polite"
            className="mt-2 text-sm text-center"
          >
            {message && (
              <div className={`inline-block px-4 py-2 rounded ${message.includes("sent") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{message}</div>
            )}
          </div>
        </>
      )}
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