import { cn } from "@/lib/utils"

interface LeaveStatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "cancelled"
  className?: string
}

export function LeaveStatusBadge({ status, className }: LeaveStatusBadgeProps) {
  const statusStyles = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  }

  return (
    <span className={cn("px-2.5 py-0.5 text-xs font-medium rounded-full border", statusStyles[status], className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
