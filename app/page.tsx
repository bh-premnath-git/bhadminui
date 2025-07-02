"use client"

import { useEffect, useMemo } from "react"
import { RecentActivities, type Activity } from "@/components/recent-activities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks"
import { fetchTenants } from "@/lib/features/tenant/tenant-slice"
import { fetchUsers } from "@/lib/features/user/user-slice"
import { Building2, Clock, CalendarDays, User } from "lucide-react"

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { tenants } = useAppSelector((state) => state.tenant)
  const { users } = useAppSelector((state) => state.user)

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

  const activities: Activity[] = useMemo(() => {
    const tenantActs = tenants.map((t) => ({
      id: `tenant-${t.id}`,
      type: "tenant_created",
      title: `Tenant created: ${t.tenant_name}`,
      description: t.tenant_description,
      timestamp: t.createdAt,
      status: "completed",
      icon: Building2,
      user: `${t.first_name} ${t.last_name}`,
    }))
    const userActs = users.map((u) => ({
      id: `user-${u.id}`,
      type: "user_created",
      title: `User created: ${u.first_name} ${u.last_name}`,
      description: u.email,
      timestamp: u.createdAt,
      status: "completed",
      icon: User,
      user: `${u.first_name} ${u.last_name}`,
    }))
    return [...tenantActs, ...userActs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [tenants, users])

  return (
      <div className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of tenant activities and stats</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivities activities={activities} limit={3} />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Active Tenants</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{activeTenants}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Pending Onboarding</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{pendingTenants}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Created This Month</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{tenantsThisMonth}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
