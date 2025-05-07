"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { type User, UserRole, type UserInvite } from "@/types/user"
import { PlusCircle, Search, Mail, MoreHorizontal, XCircle } from "lucide-react"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/ui/auth-context"

const backendRoles = ["OWNER", "SUPER_ADMIN", "ADMIN", "HR"]

export function UsersManagementForm() {
  const { orgId, userId, role: currentUserRole, user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [invites, setInvites] = useState<UserInvite[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [newInvite, setNewInvite] = useState({ email: "", role: "HR" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!orgId) return
    setLoading(true)
    Promise.all([
      fetch(`/api/org/${orgId}/users`).then(r => r.json()),
      fetch(`/api/org/${orgId}/invites`).then(r => r.json()),
    ]).then(([users, invites]) => {
      setUsers(users)
      setInvites(invites)
      setLoading(false)
    })
  }, [orgId])

  if (currentUserRole === "HR") {
    return <div className="text-gray-500">You do not have access to manage users.</div>
  }

  const canManage = currentUserRole === "OWNER" || currentUserRole === "SUPER_ADMIN"

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInviteUser = async () => {
    setError("")
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newInvite.email,
          role: newInvite.role,
          organizationId: orgId,
          invitedBy: userId,
        }),
      })
      if (!res.ok) throw new Error("Failed to send invite")
      setInvites([...invites, { ...newInvite, id: Date.now().toString(), invitedBy: user?.name, invitedAt: new Date(), expiresAt: new Date(Date.now() + 7*24*60*60*1000), status: "PENDING" }])
      setNewInvite({ email: "", role: "HR" })
      setIsInviteDialogOpen(false)
    } catch (e) {
      setError("Failed to send invite.")
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    setError("")
    try {
      const res = await fetch(`/api/org/${orgId}/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (!res.ok) throw new Error("Failed to change role")
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (e) {
      setError("Failed to change role.")
    }
  }

  const handleRemoveUser = async (userId: string) => {
    setError("")
    try {
      const res = await fetch(`/api/org/${orgId}/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      if (!res.ok) throw new Error("Failed to remove user")
      setUsers(users.filter(u => u.id !== userId))
    } catch (e) {
      setError("Failed to remove user.")
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.OWNER:
        return "bg-purple-100 text-purple-800"
      case UserRole.SUPER_ADMIN:
        return "bg-red-100 text-red-800"
      case UserRole.ADMIN:
        return "bg-orange-100 text-orange-800"
      case UserRole.HR_MANAGER:
        return "bg-blue-100 text-blue-800"
      case UserRole.PAYROLL_MANAGER:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>Send an invitation to a new user to join your organization.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Select
                  value={newInvite.role}
                  onValueChange={(value) => setNewInvite({ ...newInvite, role: value as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {backendRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteUser} disabled={!newInvite.email}>
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search users..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>{user.role.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>
                  {user.active ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>{user.lastLogin ? format(user.lastLogin, "MMM d, yyyy") : "Never"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canManage && user.role !== UserRole.OWNER && (
                        <>
                          <DropdownMenuItem onClick={() => handleChangeRole(user.id, UserRole.SUPER_ADMIN)}>
                            Make Super Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeRole(user.id, UserRole.ADMIN)}>
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeRole(user.id, UserRole.HR_MANAGER)}>
                            Make HR Manager
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeRole(user.id, UserRole.PAYROLL_MANAGER)}>
                            Make Payroll Manager
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeRole(user.id, UserRole.STANDARD)}>
                            Make Standard User
                          </DropdownMenuItem>
                        </>
                      )}
                      {user.active ? (
                        <DropdownMenuItem onClick={() => handleRemoveUser(user.id)}>
                          Deactivate User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleRemoveUser(user.id)}>Activate User</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {invites.length > 0 && (
        <>
          <h3 className="text-lg font-medium mt-8">Pending Invitations</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Invited On</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(invite.role)}>{invite.role.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>{invite.invitedBy}</TableCell>
                    <TableCell>{format(invite.invitedAt, "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(invite.expiresAt, "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveUser(invite.id)}
                          title="Cancel Invitation"
                        >
                          <XCircle size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
