// Types for tax calculation
export interface TaxBracket {
  id: string
  fromAmount: number
  toAmount: number | null
  rate: number
  baseAmount: number
  description: string
}

export interface TaxSchedule {
  id: string
  name: string
  country: string
  taxYear: string
  brackets: TaxBracket[]
  rebates?: {
    primary: number
    secondary?: number
    tertiary?: number
    medicalAid?: number
  }
}

export interface TaxableIncome {
  grossSalary: number
  taxableAllowances: number
  taxableBonus: number
  deductions: {
    retirement: number
    medicalAid: number
    other: number
  }
}

export interface TaxCalculationResult {
  taxableIncome: number
  taxBeforeRebates: number
  rebates: {
    primary: number
    secondary: number
    tertiary: number
    medicalAid: number
    total: number
  }
  taxPayable: number
  effectiveRate: number
  taxBrackets: Array<{
    bracket: TaxBracket
    amountInBracket: number
    taxForBracket: number
  }>
}

// Mock tax schedules for South Africa and Namibia
const mockTaxSchedules: TaxSchedule[] = [
  {
    id: "za-2025",
    name: "South Africa 2025",
    country: "South Africa",
    taxYear: "2025",
    brackets: [
      { id: "1", fromAmount: 0, toAmount: 237100, rate: 18, baseAmount: 0, description: "First bracket" },
      { id: "2", fromAmount: 237101, toAmount: 370500, rate: 26, baseAmount: 42678, description: "Second bracket" },
      { id: "3", fromAmount: 370501, toAmount: 512800, rate: 31, baseAmount: 77362, description: "Third bracket" },
      { id: "4", fromAmount: 512801, toAmount: 673000, rate: 36, baseAmount: 121475, description: "Fourth bracket" },
      { id: "5", fromAmount: 673001, toAmount: 857900, rate: 39, baseAmount: 179147, description: "Fifth bracket" },
      { id: "6", fromAmount: 857901, toAmount: 1817000, rate: 41, baseAmount: 251258, description: "Sixth bracket" },
      { id: "7", fromAmount: 1817001, toAmount: null, rate: 45, baseAmount: 644489, description: "Seventh bracket" },
    ],
    rebates: {
      primary: 17235,
      secondary: 9444,
      tertiary: 3145,
      medicalAid: 347,
    },
  },
  {
    id: "na-2025",
    name: "Namibia 2025",
    country: "Namibia",
    taxYear: "2025",
    brackets: [
      { id: "1", fromAmount: 0, toAmount: 50000, rate: 0, baseAmount: 0, description: "Tax exempt" },
      { id: "2", fromAmount: 50001, toAmount: 100000, rate: 18, baseAmount: 0, description: "First bracket" },
      { id: "3", fromAmount: 100001, toAmount: 300000, rate: 25, baseAmount: 9000, description: "Second bracket" },
      { id: "4", fromAmount: 300001, toAmount: 500000, rate: 28, baseAmount: 59000, description: "Third bracket" },
      { id: "5", fromAmount: 500001, toAmount: 800000, rate: 30, baseAmount: 115000, description: "Fourth bracket" },
      { id: "6", fromAmount: 800001, toAmount: 1500000, rate: 32, baseAmount: 205000, description: "Fifth bracket" },
      { id: "7", fromAmount: 1500001, toAmount: null, rate: 37, baseAmount: 429000, description: "Sixth bracket" },
    ],
  },
]

/**
 * Get the appropriate tax schedule based on country and tax year
 */
export function getTaxSchedule(country: string, taxYear: string): TaxSchedule | null {
  return mockTaxSchedules.find((schedule) => schedule.country === country && schedule.taxYear === taxYear) || null
}

/**
 * Calculate annual tax based on taxable income and tax schedule
 */
export function calculateTax(
  annualTaxableIncome: number,
  taxSchedule: TaxSchedule,
  age = 30,
  medicalAidMembers = 0,
): TaxCalculationResult {
  // Find the applicable tax bracket
  const applicableBracket = taxSchedule.brackets.find(
    (bracket) =>
      annualTaxableIncome >= bracket.fromAmount &&
      (bracket.toAmount === null || annualTaxableIncome <= bracket.toAmount),
  )

  if (!applicableBracket) {
    throw new Error("No applicable tax bracket found")
  }

  // Calculate tax for each bracket
  const taxBracketCalculations = taxSchedule.brackets
    .filter((bracket) => bracket.fromAmount <= annualTaxableIncome)
    .map((bracket) => {
      const lowerBound = bracket.fromAmount
      const upperBound =
        bracket.toAmount === null ? annualTaxableIncome : Math.min(bracket.toAmount, annualTaxableIncome)
      const amountInBracket = upperBound - lowerBound

      // For the first bracket, use the base amount + rate * amount in bracket
      // For subsequent brackets, just use the rate * amount in bracket
      const taxForBracket =
        bracket.id === applicableBracket.id
          ? bracket.baseAmount + (bracket.rate / 100) * (annualTaxableIncome - bracket.fromAmount)
          : (bracket.rate / 100) * amountInBracket

      return {
        bracket,
        amountInBracket,
        taxForBracket,
      }
    })

  // Calculate tax before rebates
  const taxBeforeRebates =
    applicableBracket.baseAmount + (applicableBracket.rate / 100) * (annualTaxableIncome - applicableBracket.fromAmount)

  // Calculate rebates (if applicable)
  const rebates = {
    primary: taxSchedule.rebates?.primary || 0,
    secondary: age >= 65 && taxSchedule.rebates?.secondary ? taxSchedule.rebates.secondary : 0,
    tertiary: age >= 75 && taxSchedule.rebates?.tertiary ? taxSchedule.rebates.tertiary : 0,
    medicalAid:
      medicalAidMembers > 0 && taxSchedule.rebates?.medicalAid ? taxSchedule.rebates.medicalAid * medicalAidMembers : 0,
    total: 0,
  }

  rebates.total = rebates.primary + rebates.secondary + rebates.tertiary + rebates.medicalAid

  // Calculate final tax payable
  const taxPayable = Math.max(0, taxBeforeRebates - rebates.total)

  // Calculate effective tax rate
  const effectiveRate = annualTaxableIncome > 0 ? (taxPayable / annualTaxableIncome) * 100 : 0

  return {
    taxableIncome: annualTaxableIncome,
    taxBeforeRebates,
    rebates,
    taxPayable,
    effectiveRate,
    taxBrackets: taxBracketCalculations,
  }
}

/**
 * Calculate monthly PAYE (Pay As You Earn) tax
 */
export function calculateMonthlyPAYE(
  monthlyEarnings: TaxableIncome,
  country: string,
  taxYear: string,
  age = 30,
  medicalAidMembers = 0,
): TaxCalculationResult | null {
  // Get the tax schedule
  const taxSchedule = getTaxSchedule(country, taxYear)
  if (!taxSchedule) return null

  // Calculate annual taxable income
  const annualGrossSalary = monthlyEarnings.grossSalary * 12
  const annualTaxableAllowances = monthlyEarnings.taxableAllowances * 12
  const annualTaxableBonus = monthlyEarnings.taxableBonus
  const annualRetirementDeduction = monthlyEarnings.deductions.retirement * 12
  const annualMedicalAidDeduction = monthlyEarnings.deductions.medicalAid * 12
  const annualOtherDeductions = monthlyEarnings.deductions.other * 12

  // Calculate total annual taxable income
  const annualTaxableIncome =
    annualGrossSalary +
    annualTaxableAllowances +
    annualTaxableBonus -
    annualRetirementDeduction -
    annualMedicalAidDeduction -
    annualOtherDeductions

  // Calculate annual tax
  const annualTaxResult = calculateTax(annualTaxableIncome, taxSchedule, age, medicalAidMembers)

  // Convert annual tax to monthly tax (divide by 12)
  const monthlyTaxResult: TaxCalculationResult = {
    ...annualTaxResult,
    taxableIncome: annualTaxResult.taxableIncome / 12,
    taxBeforeRebates: annualTaxResult.taxBeforeRebates / 12,
    rebates: {
      ...annualTaxResult.rebates,
      total: annualTaxResult.rebates.total / 12,
      primary: annualTaxResult.rebates.primary / 12,
      secondary: annualTaxResult.rebates.secondary / 12,
      tertiary: annualTaxResult.rebates.tertiary / 12,
      medicalAid: annualTaxResult.rebates.medicalAid / 12,
    },
    taxPayable: annualTaxResult.taxPayable / 12,
    // Effective rate remains the same
  }

  return monthlyTaxResult
}
