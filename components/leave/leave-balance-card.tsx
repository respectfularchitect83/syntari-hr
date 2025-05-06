import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import type { EmployeeLeaveBalances } from "@/types/leave-balance"

interface LeaveBalanceCardProps {
  employee: EmployeeLeaveBalances
  selectedLeaveType: string | null
}

// Leave type colors
const leaveTypeColors: Record<string, { bg: string; text: string; progress: string }> = {
  vacation: { bg: "bg-blue-50", text: "text-blue-700", progress: "bg-blue-500" },
  sick: { bg: "bg-red-50", text: "text-red-700", progress: "bg-red-500" },
  personal: { bg: "bg-purple-50", text: "text-purple-700", progress: "bg-purple-500" },
  maternity: { bg: "bg-pink-50", text: "text-pink-700", progress: "bg-pink-500" },
  paternity: { bg: "bg-indigo-50", text: "text-indigo-700", progress: "bg-indigo-500" },
  bereavement: { bg: "bg-gray-50", text: "text-gray-700", progress: "bg-gray-500" },
  unpaid: { bg: "bg-amber-50", text: "text-amber-700", progress: "bg-amber-500" },
}

export function LeaveBalanceCard({ employee, selectedLeaveType }: LeaveBalanceCardProps) {
  // Get leave types to display
  const leaveTypesToDisplay = selectedLeaveType ? [selectedLeaveType] : Object.keys(employee.balances)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
          <Image
            src={employee.photo || "/placeholder.svg"}
            alt={employee.name}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{employee.name}</h3>
          <p className="text-sm text-gray-500">{employee.department}</p>
        </div>
      </div>

      <div className="space-y-4">
        {leaveTypesToDisplay.map((leaveType) => {
          const balance = employee.balances[leaveType]
          if (!balance) return null

          const colors = leaveTypeColors[leaveType] || {
            bg: "bg-gray-50",
            text: "text-gray-700",
            progress: "bg-gray-500",
          }
          const percentTaken = Math.round(((balance.taken + balance.pending) / balance.entitled) * 100)

          return (
            <div key={leaveType} className={`${colors.bg} p-3 rounded-md`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium ${colors.text}`}>
                  {leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}
                </span>
                <span className={`text-sm font-medium ${colors.text}`}>
                  {balance.remaining} / {balance.entitled} days
                </span>
              </div>
              <Progress value={percentTaken} className="h-2 bg-white" indicatorClassName={colors.progress} />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-600">
                  {balance.taken > 0 && `${balance.taken} taken`}
                  {balance.taken > 0 && balance.pending > 0 && ", "}
                  {balance.pending > 0 && `${balance.pending} pending`}
                </span>
                <span className="text-gray-600">{percentTaken}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
