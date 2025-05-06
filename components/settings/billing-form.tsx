"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SubscriptionPlan, PaymentMethod, Invoice, Subscription } from "@/types/billing"
import { Check, CreditCard, Download, FileText, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"

// Mock subscription plans
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses just getting started",
    maxUsers: 10,
    price: 499,
    features: ["Up to 10 users", "Basic payroll processing", "Leave management", "Employee records", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for growing businesses with more needs",
    maxUsers: 50,
    price: 999,
    features: [
      "Up to 50 users",
      "Advanced payroll processing",
      "Tax calculations",
      "Leave management",
      "Employee records",
      "Payslip generation",
      "Priority email support",
      "Phone support",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with complex requirements",
    maxUsers: 200,
    price: 1999,
    features: [
      "Up to 200 users",
      "Advanced payroll processing",
      "Tax calculations",
      "Leave management",
      "Employee records",
      "Payslip generation",
      "Custom reports",
      "API access",
      "Dedicated account manager",
      "24/7 phone support",
    ],
  },
]

// Mock payment methods
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "card",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    createdAt: new Date(2023, 0, 15),
  },
]

// Mock invoices
const mockInvoices: Invoice[] = [
  {
    id: "inv_1",
    amount: 999,
    status: "paid",
    date: new Date(2023, 3, 1),
    dueDate: new Date(2023, 3, 15),
    pdfUrl: "#",
  },
  {
    id: "inv_2",
    amount: 999,
    status: "paid",
    date: new Date(2023, 2, 1),
    dueDate: new Date(2023, 2, 15),
    pdfUrl: "#",
  },
  {
    id: "inv_3",
    amount: 999,
    status: "paid",
    date: new Date(2023, 1, 1),
    dueDate: new Date(2023, 1, 15),
    pdfUrl: "#",
  },
]

// Mock current subscription
const mockSubscription: Subscription = {
  id: "sub_1",
  planId: "professional",
  status: "active",
  currentPeriodStart: new Date(2023, 3, 1),
  currentPeriodEnd: new Date(2023, 4, 1),
  cancelAtPeriodEnd: false,
  createdAt: new Date(2023, 0, 1),
}

export function BillingForm() {
  const [subscription, setSubscription] = useState<Subscription>(mockSubscription)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [isAddPaymentMethodDialogOpen, setIsAddPaymentMethodDialogOpen] = useState(false)
  const [isChangePlanDialogOpen, setIsChangePlanDialogOpen] = useState(false)
  const [newCardDetails, setNewCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    name: "",
  })

  const currentPlan = subscriptionPlans.find((plan) => plan.id === subscription.planId)

  const handleAddPaymentMethod = () => {
    // In a real app, this would integrate with Paystack to add a payment method
    // For now, we'll just simulate adding a card
    const last4 = newCardDetails.cardNumber.slice(-4)
    const [month, year] = newCardDetails.expiryDate.split("/")

    const newPaymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: "card",
      last4,
      expiryMonth: Number.parseInt(month),
      expiryYear: Number.parseInt(`20${year}`),
      isDefault: paymentMethods.length === 0,
      createdAt: new Date(),
    }

    setPaymentMethods([...paymentMethods, newPaymentMethod])
    setNewCardDetails({
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      name: "",
    })
    setIsAddPaymentMethodDialogOpen(false)
  }

  const handleSetDefaultPaymentMethod = (paymentMethodId: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === paymentMethodId,
      })),
    )
  }

  const handleRemovePaymentMethod = (paymentMethodId: string) => {
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== paymentMethodId))
  }

  const handleChangePlan = (planId: string) => {
    // In a real app, this would call an API to change the subscription plan
    setSubscription({
      ...subscription,
      planId,
    })
    setIsChangePlanDialogOpen(false)
  }

  const handleCancelSubscription = () => {
    // In a real app, this would call an API to cancel the subscription
    setSubscription({
      ...subscription,
      cancelAtPeriodEnd: true,
    })
  }

  const handleResumeSubscription = () => {
    // In a real app, this would call an API to resume the subscription
    setSubscription({
      ...subscription,
      cancelAtPeriodEnd: false,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{currentPlan?.name} Plan</CardTitle>
                <CardDescription>{currentPlan?.description}</CardDescription>
              </div>
              <Badge
                className={subscription.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">R{currentPlan?.price} / month</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Users</p>
                <p className="font-medium">Up to {currentPlan?.maxUsers} users</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Billing Period</p>
                <p className="font-medium">
                  {format(subscription.currentPeriodStart, "MMM d, yyyy")} -{" "}
                  {format(subscription.currentPeriodEnd, "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Renewal</p>
                <p className="font-medium">
                  {subscription.cancelAtPeriodEnd
                    ? "Cancels on " + format(subscription.currentPeriodEnd, "MMM d, yyyy")
                    : "Auto-renews on " + format(subscription.currentPeriodEnd, "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog open={isChangePlanDialogOpen} onOpenChange={setIsChangePlanDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Change Plan</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Change Subscription Plan</DialogTitle>
                  <DialogDescription>Choose the plan that best fits your organization's needs.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                  {subscriptionPlans.map((plan) => (
                    <Card key={plan.id} className={plan.isPopular ? "border-2 border-primary" : ""}>
                      {plan.isPopular && (
                        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                          Most Popular
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">
                          R{plan.price}
                          <span className="text-sm font-normal">/month</span>
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleChangePlan(plan.id)}
                          className="w-full"
                          variant={plan.id === subscription.planId ? "outline" : "default"}
                          disabled={plan.id === subscription.planId}
                        >
                          {plan.id === subscription.planId ? "Current Plan" : "Select Plan"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            {subscription.cancelAtPeriodEnd ? (
              <Button onClick={handleResumeSubscription}>Resume Subscription</Button>
            ) : (
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payment Methods</h2>
          <Dialog open={isAddPaymentMethodDialogOpen} onOpenChange={setIsAddPaymentMethodDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>Add a new credit card or debit card for billing.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={newCardDetails.name}
                    onChange={(e) => setNewCardDetails({ ...newCardDetails, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={newCardDetails.cardNumber}
                    onChange={(e) => setNewCardDetails({ ...newCardDetails, cardNumber: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={newCardDetails.expiryDate}
                      onChange={(e) => setNewCardDetails({ ...newCardDetails, expiryDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={newCardDetails.cvc}
                      onChange={(e) => setNewCardDetails({ ...newCardDetails, cvc: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddPaymentMethodDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {paymentMethods.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} />
                          {method.type === "card" ? `•••• •••• •••• ${method.last4}` : method.bank}
                        </div>
                      </TableCell>
                      <TableCell>
                        {method.expiryMonth && method.expiryYear
                          ? `${method.expiryMonth.toString().padStart(2, "0")}/${method.expiryYear.toString().slice(-2)}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {method.isDefault ? (
                          <Badge className="bg-green-100 text-green-800">Default</Badge>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleSetDefaultPaymentMethod(method.id)}>
                            Make Default
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePaymentMethod(method.id)}
                          disabled={method.isDefault}
                          title="Remove Payment Method"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <CreditCard size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No payment methods added yet</p>
              <Button onClick={() => setIsAddPaymentMethodDialogOpen(true)}>Add Payment Method</Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        {invoices.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          Invoice #{invoice.id.replace("inv_", "")}
                        </div>
                      </TableCell>
                      <TableCell>{format(invoice.date, "MMM d, yyyy")}</TableCell>
                      <TableCell>R{invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Download Invoice"
                          onClick={() => window.open(invoice.pdfUrl, "_blank")}
                        >
                          <Download size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <FileText size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-500">No invoices yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
