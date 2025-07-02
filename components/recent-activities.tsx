import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, UserPlus, Settings, CheckCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "tenant_created",
    title: "New tenant created",
    description: "Acme Corp has been successfully onboarded",
    timestamp: "2 minutes ago",
    status: "completed",
    icon: Building2,
    user: "Admin User",
  },
  {
    id: 2,
    type: "user_invited",
    title: "Users invited",
    description: "5 users invited to TechStart Inc",
    timestamp: "15 minutes ago",
    status: "pending",
    icon: UserPlus,
    user: "Admin User",
  },
  {
    id: 3,
    type: "config_updated",
    title: "Configuration updated",
    description: "SSO settings enabled for GlobalTech",
    timestamp: "1 hour ago",
    status: "completed",
    icon: Settings,
    user: "Admin User",
  },
  {
    id: 4,
    type: "onboarding_completed",
    title: "Onboarding completed",
    description: "StartupXYZ setup finalized",
    timestamp: "3 hours ago",
    status: "completed",
    icon: CheckCircle,
    user: "Admin User",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest onboarding and configuration activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <Badge variant="secondary" className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-xs">AU</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {activity.user} • {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
