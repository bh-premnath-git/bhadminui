
import { RecentActivities } from "@/components/recent-activities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
      </div>
  )
}
