"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CompanyDetailsForm } from "./company-details-form"
import { TaxSchedulesForm } from "./tax-schedules-form"
import { SocialSecurityForm } from "./social-security-form"
import { LeavePolicyForm } from "./leave-policy-form"
import { PayrollSettingsForm } from "./payroll-settings-form"
import { UsersManagementForm } from "./users-management-form"
import { BillingForm } from "./billing-form"
import { UserRole } from "@/types/user"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company")
  const [userRole, setUserRole] = useState<UserRole | null>(null)

  useEffect(() => {
    // In a real app, this would come from an auth context or API
    // For now, we'll simulate a super admin role
    setUserRole(UserRole.SUPER_ADMIN)
  }, [])

  const isAdminOrOwner = userRole === UserRole.OWNER || userRole === UserRole.SUPER_ADMIN

  return (
    <DashboardLayout>
      <div className="p-6 pt-0">
        <div className="flex justify-between items-center pt-[4.5rem] pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid grid-cols-7 gap-2">
              <TabsTrigger value="company">Company Details</TabsTrigger>
              <TabsTrigger value="tax">Tax Schedules</TabsTrigger>
              <TabsTrigger value="social">Social Security</TabsTrigger>
              <TabsTrigger value="leave">Leave Policy</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              {isAdminOrOwner && <TabsTrigger value="billing">Billing</TabsTrigger>}
            </TabsList>

            <TabsContent value="company" className="mt-0">
              <CompanyDetailsForm />
            </TabsContent>

            <TabsContent value="tax" className="mt-0">
              <TaxSchedulesForm />
            </TabsContent>

            <TabsContent value="social" className="mt-0">
              <SocialSecurityForm />
            </TabsContent>

            <TabsContent value="leave" className="mt-0">
              <LeavePolicyForm />
            </TabsContent>

            <TabsContent value="payroll" className="mt-0">
              <PayrollSettingsForm />
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <UsersManagementForm />
            </TabsContent>

            {isAdminOrOwner && (
              <TabsContent value="billing" className="mt-0">
                <BillingForm />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
