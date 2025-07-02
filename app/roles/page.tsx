"use client"

import { useState } from "react"
import { CardDescription } from "@/components/ui/card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppDispatch  } from "@/lib/hooks/redux-hooks"
import { useGetRolesQuery, useDeleteRoleMutation } from "@/lib/services/role-api-service"
import { useGetTenantsQuery } from "@/lib/services/tenant-api-service"
import { Search, Shield, Users, Settings, Eye, Edit, Trash2, MoreHorizontal, Building2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import type { RoleFilters } from "@/lib/types/role"

export default function RolesPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [filters, setFilters] = useState<RoleFilters>({})
  const { data: rolesResponse, isLoading: loading, error } = useGetRolesQuery(filters)
  const { data: tenantsResponse } = useGetTenantsQuery()
  const [deleteRole] = useDeleteRoleMutation()

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search })
  }

  const handleStatusFilter = (status: string) => {
    setFilters({ ...filters, status: status === "all" ? undefined : (status as any) })
  }

  const handleTenantFilter = (tenantId: string) => {
    setFilters({ ...filters, tenant_id: tenantId === "all" ? undefined : tenantId })
  }

  const handleDeleteRole = async (id: string) => {
    try {
      await deleteRole(id).unwrap()
      // Optionally show a success toast
    } catch (err) {
      // Optionally show an error toast
      console.error("Failed to delete the role: ", err)
    }
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const handleRoleClick = (roleId: string) => {
    router.push(`/roles/${roleId}`)
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
        <div className="text-center text-red-600">Error fetching roles. Please try again.</div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">Manage roles and permissions across tenants and system-wide</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles or tenants..."
                  className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            <Select onValueChange={handleTenantFilter}>
              <SelectTrigger className="w-48 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Filter by tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                <SelectItem value="global">Global Roles</SelectItem>
                {tenantsResponse?.data.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.tenant_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-48 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rolesResponse?.data.map((role) => (
          <Card
            key={role.id}
            className="group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 h-full flex flex-col cursor-pointer"
            onClick={() => handleRoleClick(role.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {role.name}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(role.status)} font-medium px-2 py-1 text-xs border`}>
                    {role.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRoleClick(role.id)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteRole(role.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed h-12 overflow-hidden">
                {truncateText(role.description, 100)}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
              {/* Tenant Association */}
              <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <Building2 className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {role.tenant ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{role.tenant.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 border transition-colors ${getTenantColor(false)}`}
                      >
                        Tenant
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700 dark:text-slate-300">System-wide</span>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 border transition-colors ${getTenantColor(true)}`}
                      >
                        Global
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* User Count */}
              <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <Users className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {role.userCount} {role.userCount === 1 ? "user" : "users"} assigned
                </span>
              </div>

              {/* Permissions Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Shield className="h-4 w-4" />
                  <span>Permissions</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.slice(0, 4).map((permission) => {
                    const permissionText = permission.replace("_", " ")
                    return (
                      <TooltipProvider key={permission} delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className={`w-28 text-xs px-2 py-1 border transition-colors ${getPermissionColor(
                                permission
                              )} hover:opacity-80`}
                            >
                              <div className="flex w-full items-center justify-center gap-1">
                                {getPermissionIcon(permission)}
                                <span className="truncate">{permissionText}</span>
                              </div>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{permissionText}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                  {role.permissions.length > 4 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                    >
                      +{role.permissions.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Created Date */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Created{" "}
                  {new Date(role.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rolesResponse?.data.length === 0 && (
        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-600">
          <CardContent className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Roles are empty</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {filters.search || filters.status || filters.tenant_id
                ? "Try adjusting your search or filters."
                : "There are currently no roles to display."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
