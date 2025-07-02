"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserCreationModal } from "@/components/user-creation-modal"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks"
import { fetchUsers, setFilters, createUser } from "@/lib/features/user/user-slice"
import { Search, Users, Mail, Shield, Calendar, UserPlus, Building2 } from "lucide-react"
import type { CreateUserRequest } from "@/lib/types/user"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const dispatch = useAppDispatch()
  const { users, loading, error, filters } = useAppSelector((state) => state.user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchUsers(filters))
  }, [dispatch, filters])

  const handleSearchChange = (search: string) => {
    dispatch(setFilters({ ...filters, search }))
  }

  const handleRoleFilter = (role: string) => {
    dispatch(setFilters({ ...filters, role: role === "all" ? undefined : (role as any) }))
  }

  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ ...filters, status: status === "all" ? undefined : (status as any) }))
  }

  const handleCreateUser = async (data: {
    email: string
    first_name: string
    last_name: string
    role_id?: string
    tenant_id?: string
  }) => {
    const userRequest: CreateUserRequest = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: "user", // Default role, can be enhanced based on role_id
      tenant_id: data.tenant_id,
    }

    await dispatch(createUser(userRequest))
    // Refresh the users list
    dispatch(fetchUsers(filters))
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
          <div className="text-center text-red-600">Error: {error}</div>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all duration-200 h-10 w-10"
                >
                  <UserPlus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add New User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
          {users.map((user) => (
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.role || filters.status
                  ? "Try adjusting your filters"
                  : "Get started by creating your first user"}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create a new user account</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        )}

        {/* User Creation Modal */}
        <UserCreationModal open={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={handleCreateUser} />
      </div>
  )
}
