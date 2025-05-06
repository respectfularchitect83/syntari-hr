"use client"

import { Button } from "@/components/ui/button"
import { Mail, LogOut, Edit } from "lucide-react"
import Image from "next/image"

interface UserProfilePopupProps {
  user: {
    name: string
    email: string
    photo: string
    role: string
  }
  onClose: () => void
}

export function UserProfilePopup({ user, onClose }: UserProfilePopupProps) {
  return (
    <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="p-4 border-b flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={user.photo || "/placeholder.svg"}
            alt={user.name}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </div>

      <div className="p-2">
        <div className="px-2 py-1.5 text-sm text-gray-700 flex items-center space-x-2">
          <Mail size={16} className="text-gray-500" />
          <span>{user.email}</span>
        </div>
      </div>

      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm h-9 px-2 py-1.5 text-gray-700 hover:bg-gray-100"
        >
          <Edit size={16} className="mr-2 text-gray-500" />
          Edit Profile
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-sm h-9 px-2 py-1.5 text-gray-700 hover:bg-gray-100"
        >
          <LogOut size={16} className="mr-2 text-gray-500" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
