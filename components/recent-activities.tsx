import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Activity {
  id: string | number
  type: string
  title: string
  description: string
  timestamp: string
  status: string
  icon: React.ComponentType<{ className?: string }>
  user: string
}

const defaultActivities: Activity[] = []

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

interface RecentActivitiesProps {
  activities?: Activity[]
  limit?: number
}

export function RecentActivities({ activities = defaultActivities, limit = 4 }: RecentActivitiesProps) {
  const data = activities.slice(0, limit)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest onboarding and configuration activities</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map((activity) => {
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
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No recent activities to display.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
