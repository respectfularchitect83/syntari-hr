// Mock data for payroll reports

// Department expenses data
export const mockDepartmentExpenses = [
  {
    department: "Human Resources",
    salaries: 120000,
    benefits: 25000,
    taxes: 36000,
    total: 181000,
  },
  {
    department: "Engineering",
    salaries: 350000,
    benefits: 70000,
    taxes: 105000,
    total: 525000,
  },
  {
    department: "Executive",
    salaries: 200000,
    benefits: 60000,
    taxes: 60000,
    total: 320000,
  },
  {
    department: "Marketing",
    salaries: 180000,
    benefits: 36000,
    taxes: 54000,
    total: 270000,
  },
  {
    department: "Sales",
    salaries: 220000,
    benefits: 44000,
    taxes: 66000,
    total: 330000,
  },
  {
    department: "Finance",
    salaries: 160000,
    benefits: 32000,
    taxes: 48000,
    total: 240000,
  },
  {
    department: "Operations",
    salaries: 140000,
    benefits: 28000,
    taxes: 42000,
    total: 210000,
  },
]

// Period comparison data
export const mockPeriodComparison = {
  currentYear: [
    { month: "Jan", amount: 150000 },
    { month: "Feb", amount: 155000 },
    { month: "Mar", amount: 160000 },
    { month: "Apr", amount: 158000 },
    { month: "May", amount: 162000 },
    { month: "Jun", amount: 165000 },
    { month: "Jul", amount: 170000 },
    { month: "Aug", amount: 175000 },
    { month: "Sep", amount: 180000 },
    { month: "Oct", amount: 185000 },
    { month: "Nov", amount: 190000 },
    { month: "Dec", amount: 195000 },
  ],
  previousYear: [
    { month: "Jan", amount: 140000 },
    { month: "Feb", amount: 142000 },
    { month: "Mar", amount: 145000 },
    { month: "Apr", amount: 148000 },
    { month: "May", amount: 150000 },
    { month: "Jun", amount: 152000 },
    { month: "Jul", amount: 155000 },
    { month: "Aug", amount: 158000 },
    { month: "Sep", amount: 160000 },
    { month: "Oct", amount: 162000 },
    { month: "Nov", amount: 165000 },
    { month: "Dec", amount: 170000 },
  ],
}

// Expense categories data
export const mockExpenseCategories = [
  { category: "Base Salary", value: 1200000 },
  { category: "Bonuses", value: 250000 },
  { category: "Benefits", value: 300000 },
  { category: "Taxes", value: 400000 },
  { category: "Overtime", value: 150000 },
  { category: "Allowances", value: 180000 },
]

// Payroll trends data
export const mockPayrollTrends = [
  {
    month: "Jan",
    totalExpense: 150000,
    employeeCount: 100,
    avgCostPerEmployee: 1500,
  },
  {
    month: "Feb",
    totalExpense: 155000,
    employeeCount: 102,
    avgCostPerEmployee: 1520,
  },
  {
    month: "Mar",
    totalExpense: 160000,
    employeeCount: 105,
    avgCostPerEmployee: 1524,
  },
  {
    month: "Apr",
    totalExpense: 158000,
    employeeCount: 103,
    avgCostPerEmployee: 1534,
  },
  {
    month: "May",
    totalExpense: 162000,
    employeeCount: 105,
    avgCostPerEmployee: 1543,
  },
  {
    month: "Jun",
    totalExpense: 165000,
    employeeCount: 107,
    avgCostPerEmployee: 1542,
  },
]
