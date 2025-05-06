"use client"

import { useState, useEffect } from "react"

export function AnalogClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // Calculate the rotation angles for the clock hands
  const secondsRatio = time.getSeconds() / 60
  const minutesRatio = (secondsRatio + time.getMinutes()) / 60
  const hoursRatio = (minutesRatio + time.getHours()) / 12

  const hourHandStyle = {
    transform: `rotate(${hoursRatio * 360}deg)`,
  }

  const minuteHandStyle = {
    transform: `rotate(${minutesRatio * 360}deg)`,
  }

  const secondHandStyle = {
    transform: `rotate(${secondsRatio * 360}deg)`,
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-medium text-gray-700 mb-2">Current Time</h2>
      <div className="relative w-32 h-32 rounded-full border-4 border-gray-200 bg-white">
        {/* Clock face */}
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-3 bg-gray-800"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-36px)`,
                transformOrigin: "bottom center",
              }}
            />
          ))}

          {/* Hour hand */}
          <div className="absolute h-[25px] w-[4px] bg-gray-900 rounded-full origin-bottom" style={hourHandStyle} />

          {/* Minute hand */}
          <div className="absolute h-[35px] w-[3px] bg-gray-700 rounded-full origin-bottom" style={minuteHandStyle} />

          {/* Second hand */}
          <div className="absolute h-[40px] w-[2px] bg-red-500 rounded-full origin-bottom" style={secondHandStyle} />

          {/* Center dot */}
          <div className="absolute w-3 h-3 bg-gray-900 rounded-full" />
        </div>
      </div>
      <p className="mt-3 text-gray-600">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
    </div>
  )
}
