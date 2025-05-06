"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface PeriodData {
  month: string
  amount: number
}

interface PeriodComparisonData {
  currentYear: PeriodData[]
  previousYear: PeriodData[]
}

interface PeriodComparisonChartProps {
  data: PeriodComparisonData
  selectedPeriod: string
}

export default function PeriodComparisonChart({ data, selectedPeriod }: PeriodComparisonChartProps) {
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

    // Calculate percentage change
    const percentageChange = data.currentYear.map((current, index) => {
      const previous = data.previousYear[index]
      return ((current.amount - previous.amount) / previous.amount) * 100
    })

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.currentYear.map((item) => item.month),
        datasets: [
          {
            label: "Current Year",
            data: data.currentYear.map((item) => item.amount),
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
            order: 2,
          },
          {
            label: "Previous Year",
            data: data.previousYear.map((item) => item.amount),
            backgroundColor: "rgba(156, 163, 175, 0.7)",
            borderColor: "rgba(156, 163, 175, 1)",
            borderWidth: 1,
            order: 3,
          },
          {
            label: "% Change",
            data: percentageChange,
            type: "line",
            borderColor: "rgba(220, 38, 38, 1)",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(220, 38, 38, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(220, 38, 38, 1)",
            yAxisID: "percentage",
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Comparison (Current vs Previous Year)`,
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
                if (label === "% Change") {
                  return `${label}: ${value.toFixed(2)}%`
                }
                return `${label}: R${value.toLocaleString()}`
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
          y: {
            title: {
              display: true,
              text: "Amount (R)",
            },
            ticks: {
              callback: (value) => "R" + value.toLocaleString(),
            },
          },
          percentage: {
            position: "right",
            title: {
              display: true,
              text: "Percentage Change (%)",
            },
            ticks: {
              callback: (value) => value + "%",
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
  }, [data, selectedPeriod])

  return <canvas ref={chartRef} />
}
