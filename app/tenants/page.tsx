"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks"
import { fetchTenants, setFilters } from "@/lib/features/tenant/tenant-slice"
import { Search, Building2, Mail, User, Tag, MoreHorizontal, Edit, Trash2, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TenantCreationModal } from "@/components/tenant-creation-modal"

export default function TenantsPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { tenants, loading, error, filters } = useAppSelector((state) => state.tenant)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchTenants(filters))
  }, [dispatch, filters])

  const handleSearchChange = (search: string) => {
    dispatch(setFilters({ ...filters, search }))
  }

  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ ...filters, status: status === "all" ? undefined : (status as any) }))
  }

  const handleTenantClick = (tenantId: string) => {
    router.push(`/tenants/${tenantId}`)
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const handleAddTenant = () => {
    setIsModalOpen(true)
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
            <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
            <p className="text-muted-foreground">Manage all your tenants and their configurations</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={handleAddTenant}
                  className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all duration-200 h-10 w-10"
                >
                  <UserPlus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add New Tenant</p>
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
                    placeholder="Search tenants..."
                    className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>
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

        {/* Tenants Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <Card
              key={tenant.id}
              className="group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 h-full flex flex-col cursor-pointer"
              onClick={() => handleTenantClick(tenant.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {tenant.tenant_name}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(tenant.status)} font-medium px-2 py-1 text-xs border`}>
                      {tenant.status}
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
                            handleTenantClick(tenant.id)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Tenant
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Tenant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed h-10 overflow-hidden">
                  {truncateText(tenant.tenant_description, 80)}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{tenant.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <User className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                      {tenant.first_name} {tenant.last_name}
                    </span>
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                  {Object.keys(tenant.bh_tags).length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Tag className="h-4 w-4" />
                        <span>Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
                        {Object.entries(tenant.bh_tags)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <Badge
                              key={key}
                              variant="outline"
                              className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              {truncateText(value, 12)}
                            </Badge>
                          ))}
                        {Object.keys(tenant.bh_tags).length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                          >
                            +{Object.keys(tenant.bh_tags).length - 3}
                          </Badge>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 min-h-[2rem]">
                      <Tag className="h-4 w-4" />
                      <span>No tags</span>
                    </div>
                  )}
                </div>

                {/* Created Date */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Created{" "}
                    {new Date(tenant.createdAt).toLocaleDateString("en-US", {
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

        {tenants.length === 0 && (
          <Card className="border-dashed border-2 border-slate-300 dark:border-slate-600">
            <CardContent className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">No tenants found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                {filters.search || filters.status
                  ? "Try adjusting your filters to see more results"
                  : "Get started by creating your first tenant to begin managing your organization"}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleAddTenant}
                      className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Your First Tenant
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create a new tenant to get started</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        )}
        {/* Tenant Creation Modal */}
        <TenantCreationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
  )
}
