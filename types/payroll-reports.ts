export interface DepartmentExpense {
  department: string
  basicSalary: number
  overtime: number
  bonus: number
  benefits: number
  total: number
}

export interface PeriodComparisonData {
  period: string
  previousYear: number
  currentYear: number
  percentageChange: number
}

export interface ExpenseCategory {
  category: string
  amount: number
  percentage: number
}

export interface PayrollTrend {
  month: string
  year: number
  amount: number
  employeeCount: number
  averagePerEmployee: number
}

export interface DepartmentPayrollData {
  department: string
  monthlyData: {
    month: string
    amount: number
  }[]
}
