"use client"

import type React from "react"

import { useState } from "react"
import type { PersonDetail } from "./dashboard-page"
import { ChevronRight } from "lucide-react"

interface FlipCardProps {
  title: string
  value: string
  details: PersonDetail[]
  onPersonClick: (id: string) => void
}

export function FlipCard({ title, value, details, onPersonClick }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    // Only flip if there are details to show
    if (details.length > 0) {
      setIsFlipped(!isFlipped)
    }
  }

  const handlePersonClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Prevent card from flipping back
    onPersonClick(id)
  }

  return (
    <div
      className={`relative h-[180px] w-full perspective-1000 cursor-pointer ${details.length === 0 ? "cursor-default" : ""}`}
      onClick={handleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full backface-hidden bg-white rounded-lg p-6 shadow-lg flex flex-col items-center justify-center ${
            details.length > 0 ? "hover:shadow-xl transition-shadow" : ""
          }`}
        >
          <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>

          {details.length > 0 && (
            <div className="absolute bottom-3 right-3 text-gray-400">
              <ChevronRight size={18} />
            </div>
          )}
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg p-4 shadow-lg overflow-auto">
          <h3 className="text-gray-500 font-medium text-sm mb-3 text-center">{title}</h3>

          <ul className="space-y-2">
            {details.map((person) => (
              <li
                key={person.id}
                className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={(e) => handlePersonClick(e, person.id)}
              >
                <p className="font-medium text-gray-900">{person.name}</p>
                <p className="text-xs text-gray-500">{person.department}</p>
              </li>
            ))}
          </ul>

          <div className="absolute bottom-3 right-3 text-gray-400">
            <ChevronRight size={18} className="rotate-180" />
          </div>
        </div>
      </div>
    </div>
  )
}
