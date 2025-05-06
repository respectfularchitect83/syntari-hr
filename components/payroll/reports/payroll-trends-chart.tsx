"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface PayrollTrend {
  month: string
  totalExpense: number
  employeeCount: number
  avgCostPerEmployee: number
}

interface PayrollTrendsChartProps {
  data: PayrollTrend[]
  selectedDepartment: string
}

export default function PayrollTrendsChart({ data, selectedDepartment }: PayrollTrendsChartProps) {
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

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.month),
        datasets: [
          {
            label: "Total Expense",
            data: data.map((item) => item.totalExpense),
            borderColor: "rgba(59, 130, 246, 1)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            fill: true,
            yAxisID: "expense",
          },
          {
            label: "Employee Count",
            data: data.map((item) => item.employeeCount),
            borderColor: "rgba(16, 185, 129, 1)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 2,
            fill: true,
            yAxisID: "count",
          },
          {
            label: "Avg Cost Per Employee",
            data: data.map((item) => item.avgCostPerEmployee),
            borderColor: "rgba(245, 158, 11, 1)",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderWidth: 2,
            fill: true,
            yAxisID: "average",
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
                ? "Payroll Trends (All Departments)"
                : `Payroll Trends (${selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1)})`,
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
                if (label === "Total Expense") {
                  return `${label}: R${value.toLocaleString()}`
                } else if (label === "Employee Count") {
                  return `${label}: ${value}`
                } else if (label === "Avg Cost Per Employee") {
                  return `${label}: R${value.toLocaleString()}`
                }
                return `${label}: ${value}`
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
          expense: {
            type: "linear",
            position: "left",
            title: {
              display: true,
              text: "Total Expense (R)",
            },
            ticks: {
              callback: (value) => "R" + value.toLocaleString(),
            },
          },
          count: {
            type: "linear",
            position: "right",
            title: {
              display: true,
              text: "Employee Count",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          average: {
            type: "linear",
            position: "right",
            title: {
              display: true,
              text: "Avg Cost Per Employee (R)",
            },
            ticks: {
              callback: (value) => "R" + value.toLocaleString(),
            },
            grid: {
              drawOnChartArea: false,
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
  }, [data, selectedDepartment])

  return <canvas ref={chartRef} />
}
