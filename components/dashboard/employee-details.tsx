"use client"

import Image from "next/image"
import { X, Mail, Phone, Calendar, Briefcase, User, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Employee } from "./dashboard-page"

interface EmployeeDetailsProps {
  employee: Employee
  onClose: () => void
  onEdit?: () => void
}

export function EmployeeDetails({ employee, onClose, onEdit }: EmployeeDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">Employee Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X size={18} />
            </Button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-md">
              <Image
                src={employee.photo || "/placeholder.svg"}
                alt={`${employee.name} photo`}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
            <p className="text-gray-600">{employee.position}</p>
            {employee.status === "On Leave" && (
              <span className="mt-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">On Leave</span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="text-gray-900">{employee.department}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{employee.phone}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Birthday</p>
                <p className="text-gray-900">{employee.birthday}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="text-gray-900">{employee.hireDate}</p>
              </div>
            </div>

            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Manager</p>
                <p className="text-gray-900">{employee.manager}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button
              className="flex-1 bg-[#454636] hover:bg-[#5a5b47] text-white shadow-md flex items-center justify-center gap-2"
              onClick={onEdit}
            >
              <Edit size={16} />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex-1 shadow-sm">
              View Documents
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
