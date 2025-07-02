import { TenantOnboardingForm } from "@/components/tenant-onboarding-form"
import { RecentActivities } from "@/components/recent-activities"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
      <div className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Onboarding</h1>
          <p className="text-muted-foreground">Manage and configure new tenant setups</p>
        </div>

        <div className="grid gap-6">
          {/* First row: Onboarding form and Quick stats side by side */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>New Tenant Setup</CardTitle>
                  <CardDescription>Complete the onboarding process for a new tenant</CardDescription>
                </CardHeader>
                <CardContent>
                  <TenantOnboardingForm />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Tenants</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending Onboarding</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-medium">8</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div>
            <RecentActivities />
          </div>
        </div>
      </div>
  )
}
