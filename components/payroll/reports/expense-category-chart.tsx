"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface ExpenseCategory {
  category: string
  value: number
}

interface ExpenseCategoryChartProps {
  data: ExpenseCategory[]
  selectedDepartment: string
}

export default function ExpenseCategoryChart({ data, selectedDepartment }: ExpenseCategoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.map((item) => item.category),
        datasets: [
          {
            data: data.map((item) => item.value),
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(220, 38, 38, 0.7)",
              "rgba(139, 92, 246, 0.7)",
              "rgba(236, 72, 153, 0.7)",
            ],
            borderColor: [
              "rgba(59, 130, 246, 1)",
              "rgba(16, 185, 129, 1)",
              "rgba(245, 158, 11, 1)",
              "rgba(220, 38, 38, 1)",
              "rgba(139, 92, 246, 1)",
              "rgba(236, 72, 153, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text:
              selectedDepartment === "all"
                ? "Expense Categories (All Departments)"
                : `Expense Categories (${selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1)})`,
            font: {
              size: 16,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw as number
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: R${value.toLocaleString()} (${percentage}%)`
              },
            },
          },
          legend: {
            position: "right",
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, selectedDepartment])

  return <canvas ref={chartRef} />
}
