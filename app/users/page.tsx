"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetUsersQuery } from "@/lib/services/user-api-service"
import { Search, Users, Mail, Shield, Calendar, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { UserFilters } from "@/lib/types/user"

export default function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({})
  const { data: usersResponse, isLoading, error } = useGetUsersQuery(filters)
  const router = useRouter()

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search })
  }

  const handleRoleFilter = (role: string) => {
    setFilters({ ...filters, role: role === "all" ? undefined : (role as any) })
  }

  const handleStatusFilter = (status: string) => {
    setFilters({ ...filters, status: status === "all" ? undefined : (status as any) })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "user":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
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

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`)
  }

  if (isLoading) {
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
          <div className="text-center text-red-600">Error fetching users. Please try again.</div>
        </div>
    )
  }

  return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage users across all tenants with role assignments</p>
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
                    placeholder="Search users..."
                    className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>
              <Select onValueChange={handleRoleFilter}>
                <SelectTrigger className="w-48 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-48 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {usersResponse?.data.map((user) => (
            <Card
              key={user.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleUserClick(user.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">
                      {user.first_name} {user.last_name}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Role: {user.role}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {getTenantName(user.tenant_id)}
                  </div>
                  {user.last_login && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Last login: {new Date(user.last_login).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUserClick(user.id)
                    }}
                  >
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {usersResponse?.data.length === 0 && (
          <Card className="border-dashed border-2 border-slate-300 dark:border-slate-600">
            <CardContent className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Users are empty</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {filters.search || filters.role || filters.status
                  ? "Try adjusting your search or filters."
                  : "There are currently no users to display."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
  )
}
