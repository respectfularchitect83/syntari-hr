"use client"

import { Check, X } from "lucide-react"

interface DepartmentFilterProps {
  departments: string[]
  selectedDepartment: string | null
  onSelect: (department: string | null) => void
  onClose: () => void
}

export function DepartmentFilter({ departments, selectedDepartment, onSelect, onClose }: DepartmentFilterProps) {
  return (
    <div className="absolute right-0 top-10 z-10 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium text-gray-700">Filter by Department</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
      <div className="p-2">
        <button
          className="flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100"
          onClick={() => onSelect(null)}
        >
          <span>All Departments</span>
          {selectedDepartment === null && <Check size={16} className="text-[#454636]" />}
        </button>
        {departments.map((department) => (
          <button
            key={department}
            className="flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100"
            onClick={() => onSelect(department)}
          >
            <span>{department}</span>
            {selectedDepartment === department && <Check size={16} className="text-[#454636]" />}
          </button>
        ))}
      </div>
    </div>
  )
}
