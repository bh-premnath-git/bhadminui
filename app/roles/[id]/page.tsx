"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGetRoleByIdQuery, useDeleteRoleMutation } from "@/lib/services/role-api-service"
import {
  ArrowLeft,
  Shield,
  Users,
  Building2,
  Calendar,
  Edit,
  Trash2,
  Settings,
  Activity,
  Eye,
  UserPlus,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function RoleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roleId = params.id as string

  const { data: currentRole, isLoading: loading, error } = useGetRoleByIdQuery(roleId, {
    skip: !roleId, // Don't fetch until we have an ID
  })
  const [deleteRole] = useDeleteRoleMutation()

  const handleBack = () => {
    router.push("/roles")
  }

  const handleEdit = () => {
    // Navigate to an edit page or open a modal
    if (currentRole) {
      router.push(`/roles/${currentRole.id}/edit`)
    }
  }

  const handleDelete = async () => {
    if (!currentRole) return
    try {
      await deleteRole(currentRole.id).unwrap()
      router.push("/roles")
    } catch (err) {
      console.error("Failed to delete the role:", err)
      // Optionally show an error toast
    }
  }

  const handleManageUsers = () => {
    console.log("Manage users for role:", currentRole?.id)
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
          <div className="text-red-600 mb-4">Failed to load role details.</div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Button>
        </div>
      </div>
    )
  }

  if (!currentRole) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">Role not found</div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800"
    }
  }

  const getTenantColor = (isGlobal: boolean) => {
    if (isGlobal) {
      return "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 dark:from-purple-900/30 dark:to-indigo-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
    }
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
  }

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "read":
        return <Eye className="h-3 w-3" />
      case "write":
        return <Edit className="h-3 w-3" />
      case "delete":
        return <Trash2 className="h-3 w-3" />
      case "admin":
        return <Shield className="h-3 w-3" />
      case "manage_users":
        return <Users className="h-3 w-3" />
      default:
        return <Settings className="h-3 w-3" />
    }
  }

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "read":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "write":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      case "delete":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
      case "manage_users":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800"
    }
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
            <h1 className="text-3xl font-bold tracking-tight">{currentRole.name}</h1>
            <p className="text-muted-foreground">Role Details and Permissions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(currentRole.status)} font-medium px-3 py-1 text-sm border`}>
            {currentRole.status}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleEdit} variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Role</p>
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
                <p>Delete Role</p>
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
                <Shield className="h-5 w-5 text-purple-600" />
                <CardTitle>Role Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role Name</label>
                <p className="text-lg font-semibold">{currentRole.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm leading-relaxed">{currentRole.description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(currentRole.status)} font-medium px-2 py-1 text-xs border`}>
                      {currentRole.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role ID</label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">{currentRole.id}</p>
                </div>
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
              {currentRole.tenant ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">{currentRole.tenant.name}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This role is specific to the {currentRole.tenant.name} tenant
                    </p>
                  </div>
                  <Badge variant="outline" className={`px-2 py-1 border transition-colors ${getTenantColor(false)}`}>
                    Tenant Role
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div className="flex-1">
                    <p className="font-medium text-purple-900 dark:text-purple-100">Global Role</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      This role has system-wide access across all tenants
                    </p>
                  </div>
                  <Badge variant="outline" className={`px-2 py-1 border transition-colors ${getTenantColor(true)}`}>
                    Global
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-green-600" />
                <CardTitle>Permissions & Access</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  This role grants the following permissions to assigned users:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentRole.permissions.map((permission) => (
                    <Badge
                      key={permission}
                      variant="outline"
                      className={`px-3 py-2 border transition-colors ${getPermissionColor(permission)} hover:opacity-80`}
                    >
                      <div className="flex items-center gap-2">
                        {getPermissionIcon(permission)}
                        <span className="font-medium">{permission.replace("_", " ")}</span>
                      </div>
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Total Permissions:</strong> {currentRole.permissions.length} permission
                    {currentRole.permissions.length !== 1 ? "s" : ""} granted
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Assigned Users</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{currentRole.userCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Permissions</span>
                </div>
                <span className="text-lg font-bold text-green-600">{currentRole.permissions.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Last Activity</span>
                </div>
                <span className="text-sm font-medium text-purple-600">1 hour ago</span>
              </div>
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
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">
                  {new Date(currentRole.createdAt).toLocaleDateString("en-US", {
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
                  {new Date(currentRole.updatedAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
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
                Edit Role
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleManageUsers}>
                <Users className="h-4 w-4 mr-2" />
                Manage Users ({currentRole.userCount})
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Users
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Edit Permissions
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Role
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
