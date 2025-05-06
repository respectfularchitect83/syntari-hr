export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  maxUsers: number
  price: number
  features: string[]
  isPopular?: boolean
}

export interface PaymentMethod {
  id: string
  type: "card" | "bank"
  last4: string
  expiryMonth?: number
  expiryYear?: number
  bank?: string
  isDefault: boolean
  createdAt: Date
}

export interface Invoice {
  id: string
  amount: number
  status: "paid" | "pending" | "failed"
  date: Date
  dueDate: Date
  pdfUrl?: string
}

export interface Subscription {
  id: string
  planId: string
  status: "active" | "canceled" | "past_due" | "trialing"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
}
