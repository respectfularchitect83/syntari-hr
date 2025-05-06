"use client"

import { useState } from "react"
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

// Mock data for users
const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    role: UserRole.OWNER,
    active: true,
    lastLogin: new Date(2023, 4, 15),
    createdAt: new Date(2023, 0, 10),
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    role: UserRole.SUPER_ADMIN,
    active: true,
    lastLogin: new Date(2023, 4, 14),
    createdAt: new Date(2023, 1, 5),
  },
  {
    id: "3",
    email: "bob.johnson@example.com",
    name: "Bob Johnson",
    role: UserRole.HR_MANAGER,
    active: true,
    lastLogin: new Date(2023, 4, 10),
    createdAt: new Date(2023, 2, 15),
  },
  {
    id: "4",
    email: "alice.williams@example.com",
    name: "Alice Williams",
    role: UserRole.PAYROLL_MANAGER,
    active: false,
    lastLogin: new Date(2023, 3, 20),
    createdAt: new Date(2023, 2, 20),
  },
]

// Mock data for pending invites
const mockInvites: UserInvite[] = [
  {
    id: "1",
    email: "mark.taylor@example.com",
    role: UserRole.STANDARD,
    invitedBy: "John Doe",
    invitedAt: new Date(2023, 4, 10),
    expiresAt: new Date(2023, 5, 10),
    status: "PENDING",
  },
  {
    id: "2",
    email: "sarah.brown@example.com",
    role: UserRole.HR_MANAGER,
    invitedBy: "John Doe",
    invitedAt: new Date(2023, 4, 12),
    expiresAt: new Date(2023, 5, 12),
    status: "PENDING",
  },
]

export function UsersManagementForm() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [invites, setInvites] = useState<UserInvite[]>(mockInvites)
  const [searchTerm, setSearchTerm] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [newInvite, setNewInvite] = useState({
    email: "",
    role: UserRole.STANDARD,
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInviteUser = () => {
    // In a real app, this would call an API to send the invite
    const newInviteObj: UserInvite = {
      id: `invite-${Date.now()}`,
      email: newInvite.email,
      role: newInvite.role,
      invitedBy: "John Doe", // This would be the current user
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "PENDING",
    }

    setInvites([...invites, newInviteObj])
    setNewInvite({ email: "", role: UserRole.STANDARD })
    setIsInviteDialogOpen(false)
  }

  const handleResendInvite = (inviteId: string) => {
    // In a real app, this would call an API to resend the invite
    alert(`Invite resent to user with ID: ${inviteId}`)
  }

  const handleCancelInvite = (inviteId: string) => {
    // In a real app, this would call an API to cancel the invite
    setInvites(invites.filter((invite) => invite.id !== inviteId))
  }

  const handleDeactivateUser = (userId: string) => {
    // In a real app, this would call an API to deactivate the user
    setUsers(users.map((user) => (user.id === userId ? { ...user, active: false } : user)))
  }

  const handleActivateUser = (userId: string) => {
    // In a real app, this would call an API to activate the user
    setUsers(users.map((user) => (user.id === userId ? { ...user, active: true } : user)))
  }

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    // In a real app, this would call an API to change the user's role
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
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
                    <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.HR_MANAGER}>HR Manager</SelectItem>
                    <SelectItem value={UserRole.PAYROLL_MANAGER}>Payroll Manager</SelectItem>
                    <SelectItem value={UserRole.STANDARD}>Standard User</SelectItem>
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
                      {user.role !== UserRole.OWNER && (
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
                        <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                          Deactivate User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>Activate User</DropdownMenuItem>
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
                          onClick={() => handleResendInvite(invite.id)}
                          title="Resend Invitation"
                        >
                          <Mail size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelInvite(invite.id)}
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
