"use client"

import Image from "next/image"
import type { Employee } from "./dashboard-page"

interface EmployeeCardProps {
  employee: Employee
  onClick: () => void
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  return (
    <div
      className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center"
      onClick={onClick}
    >
      <div className="w-20 h-20 rounded-full overflow-hidden mb-3 shadow-md">
        <Image
          src={employee.photo || "/placeholder.svg"}
          alt={`${employee.name} photo`}
          width={80}
          height={80}
          className="object-cover"
        />
      </div>
      <h3 className="font-medium text-gray-900 text-center">{employee.name}</h3>
      <p className="text-gray-500 text-xs text-center">{employee.department}</p>
      <p className="text-gray-400 text-xs mt-1">Birthday: {employee.birthday}</p>
      {employee.status === "On Leave" && (
        <span className="mt-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">On Leave</span>
      )}
    </div>
  )
}
