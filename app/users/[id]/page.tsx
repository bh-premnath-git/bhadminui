"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks"
import { fetchUserById, clearCurrentUser } from "@/lib/features/user/user-slice"
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Building2,
  Calendar,
  Edit,
  Trash2,
  Settings,
  Activity,
  Clock,
  UserCheck,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentUser, loading, error } = useAppSelector((state) => state.user)

  const userId = params.id as string

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId))
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentUser())
    }
  }, [dispatch, userId])

  const handleBack = () => {
    router.push("/users")
  }

  const handleEdit = () => {
    console.log("Edit user:", currentUser?.id)
  }

  const handleDelete = () => {
    console.log("Delete user:", currentUser?.id)
  }

  const handleChangeRole = () => {
    console.log("Change role for user:", currentUser?.id)
  }

  if (loading) {
    return (
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="flex-1 space-y-6 p-6">
          <div className="text-center">
            <div className="text-red-600 mb-4">Error: {error}</div>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </div>
    )
  }

  if (!currentUser) {
    return (
        <div className="flex-1 space-y-6 p-6">
          <div className="text-center">
            <div className="text-muted-foreground mb-4">User not found</div>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
      case "user":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800"
    }
  }

  // Mock tenant data for display
  const getTenantName = (tenantId?: string) => {
    const tenants: Record<string, string> = {
      "1": "Acme Corporation",
      "2": "Global Dynamics",
      "3": "StartupXYZ",
    }
    return tenantId ? tenants[tenantId] : "No tenant assigned"
  }

  return (
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={handleBack} variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {currentUser.first_name} {currentUser.last_name}
              </h1>
              <p className="text-muted-foreground">User Profile and Account Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(currentUser.status)} font-medium px-3 py-1 text-sm border`}>
              {currentUser.status}
            </Badge>
            <Badge className={`${getRoleColor(currentUser.role)} font-medium px-3 py-1 text-sm border`}>
              {currentUser.role}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleEdit} variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit User</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDelete}
                    variant="outline"
                    size="icon"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete User</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <CardTitle>User Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                    <p className="text-lg font-semibold">{currentUser.first_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                    <p className="text-lg font-semibold">{currentUser.last_name}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{currentUser.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(currentUser.status)} font-medium px-2 py-1 text-xs border`}>
                        {currentUser.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">{currentUser.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role & Permissions */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <CardTitle>Role & Permissions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div className="flex-1">
                    <p className="font-medium text-purple-900 dark:text-purple-100 capitalize">
                      {currentUser.role} Role
                    </p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      {currentUser.role === "admin"
                        ? "Full administrative access with user management capabilities"
                        : currentUser.role === "user"
                          ? "Standard user access with read and write permissions"
                          : "View-only access for reporting and monitoring"}
                    </p>
                  </div>
                  <Badge className={`${getRoleColor(currentUser.role)} font-medium px-2 py-1 text-xs border`}>
                    {currentUser.role}
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleChangeRole}>
                    <Shield className="h-4 w-4 mr-2" />
                    Change Role
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tenant Association */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <CardTitle>Tenant Association</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {currentUser.tenant_id ? (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        {getTenantName(currentUser.tenant_id)}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        User has access to this tenant's resources and data
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    >
                      Assigned
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-950/30 rounded-lg border border-gray-200 dark:border-gray-800">
                    <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">No Tenant Assigned</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        User currently has no tenant association
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                    >
                      Unassigned
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Account Status</span>
                  </div>
                  <Badge className={`${getStatusColor(currentUser.status)} text-xs`}>{currentUser.status}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Role Level</span>
                  </div>
                  <Badge className={`${getRoleColor(currentUser.role)} text-xs`}>{currentUser.role}</Badge>
                </div>
                {currentUser.last_login && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Last Active</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      {new Date(currentUser.last_login).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-lg">Timeline</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                  <p className="text-sm">
                    {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">
                    {new Date(currentUser.updatedAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {currentUser.last_login && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm">
                        {new Date(currentUser.last_login).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleChangeRole}>
                  <Shield className="h-4 w-4 mr-2" />
                  Change Role
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Building2 className="h-4 w-4 mr-2" />
                  Change Tenant
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
