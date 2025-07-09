"use client"
import { useMemo } from "react"
import { RecentActivities,  type Activity  } from "@/components/recent-activities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetTenantsQuery } from "@/lib/services/tenant-api-service"
import { Building2 } from "lucide-react"

export default function HomePage() {
  const { data: tenantsResponse } = useGetTenantsQuery()

  const tenants = tenantsResponse?.data ?? []

  const activeTenants = tenants.filter((t) => t.tenant_status === "active").length
  const pendingTenants = tenants.filter((t) => t.tenant_status === "inactive").length
  const tenantsThisMonth = tenants.filter((t) => {
    if (!t.created_at) return false
    try {
      // Handle both ISO string format and other common formats
      const created = new Date(t.created_at)
      const now = new Date()
      
      // Check if the date is valid
      if (isNaN(created.getTime())) {
        console.warn(`Invalid date format for tenant ${t.id}: ${t.created_at}`)
        return false
      }
      
      // Compare using UTC to avoid timezone issues
      const createdUTC = new Date(created.getUTCFullYear(), created.getUTCMonth(), created.getUTCDate())
      const nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      
      console.log(`Tenant ${t.id}: Created ${createdUTC.toISOString().split('T')[0]}, Now ${nowUTC.toISOString().split('T')[0]}`)
      
      return (
        createdUTC.getMonth() === nowUTC.getMonth() &&
        createdUTC.getFullYear() === nowUTC.getFullYear()
      )
    } catch (error) {
      console.warn(`Error parsing date for tenant ${t.id}:`, error)
      return false
    }
  }).length

  const activities: Activity[] = useMemo(() => {
    const tenantActs = tenants.map((t) => ({
      id: `tenant-${t.id}`,
      type: "tenant_created",
      title: `Tenant created: ${t.tenant_name}`,
      description: t.tenant_description,
      timestamp: t.created_at,
      status: "completed",
      icon: Building2
    }))
    return [...tenantActs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [tenants])

  return (
      <div className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of tenant activities and stats</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivities activities={activities} limit={3}/>

          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tenants.length > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Tenants</span>
                      <span className="font-medium">{activeTenants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pending Onboarding</span>
                      <span className="font-medium">{pendingTenants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-medium">{tenantsThisMonth}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No tenant data to display.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
