
"use client"
import { useEffect } from "react"
import { RecentActivities } from "@/components/recent-activities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks"
import { fetchTenants } from "@/lib/features/tenant/tenant-slice"
import { fetchUsers } from "@/lib/features/user/user-slice"

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { tenants } = useAppSelector((state) => state.tenant)

  useEffect(() => {
    dispatch(fetchTenants())
    dispatch(fetchUsers())
  }, [dispatch])

  const activeTenants = tenants.filter((t) => t.status === "active").length
  const pendingTenants = tenants.filter((t) => t.status === "pending").length
  const tenantsThisMonth = tenants.filter((t) => {
    const created = new Date(t.createdAt)
    const now = new Date()
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    )
  }).length

  return (
      <div className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of tenant activities and stats</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivities />

          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
