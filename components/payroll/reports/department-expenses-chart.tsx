"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface DepartmentExpense {
  department: string
  salaries: number
  benefits: number
  taxes: number
  total: number
}

interface DepartmentExpensesChartProps {
  data: DepartmentExpense[]
  selectedDepartment: string
  selectedPeriod: string
}

export default function DepartmentExpensesChart({
  data,
  selectedDepartment,
  selectedPeriod,
}: DepartmentExpensesChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Filter data based on selected department
    const filteredData =
      selectedDepartment === "all"
        ? data
        : data.filter((item) => item.department.toLowerCase().includes(selectedDepartment.toLowerCase()))

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: filteredData.map((item) => item.department),
        datasets: [
          {
            label: "Salaries",
            data: filteredData.map((item) => item.salaries),
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          },
          {
            label: "Benefits",
            data: filteredData.map((item) => item.benefits),
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 1,
          },
          {
            label: "Taxes",
            data: filteredData.map((item) => item.taxes),
            backgroundColor: "rgba(245, 158, 11, 0.7)",
            borderColor: "rgba(245, 158, 11, 1)",
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
            text: `Department Expenses (${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})`,
            font: {
              size: 16,
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || ""
                const value = context.parsed.y
                return `${label}: R${value.toLocaleString()}`
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: "Department",
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "Amount (R)",
            },
            ticks: {
              callback: (value) => "R" + value.toLocaleString(),
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, selectedDepartment, selectedPeriod])

  return <canvas ref={chartRef} />
}
