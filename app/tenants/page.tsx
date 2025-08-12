"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGetTenantsQuery, useDeleteTenantMutation } from "@/lib/services/tenant-api-service"
import { Search, Building2, Tag, MoreHorizontal, Edit, Trash2, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TenantCreationModal } from "@/components/tenant-creation-modal"
import type { TenantFilters } from "@/lib/types/tenant"

const PAGE_SIZE = 6

export default function TenantsPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<TenantFilters>({})
  const [offset, setOffset] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: tenantsResponse, isLoading: loading, error } = useGetTenantsQuery({
    ...filters,
    limit: PAGE_SIZE,
    offset,
  })
  const [deleteTenant] = useDeleteTenantMutation()

  const handleSearchChange = (search: string) => {
    setOffset(0)
    setFilters({ ...filters, search })
  }

  const handleStatusFilter = (status: string) => {
    setOffset(0)
    setFilters({ ...filters, tenant_status: status === "all" ? undefined : (status as any) })
  }

  const handleTenantClick = (tenantKey: string) => {
    router.push(`/tenants/${tenantKey}`)
  }

  const handleEdit = (tenantKey: string) => {
    router.push(`/tenants/${tenantKey}/edit`)
  }

  const handleDelete = async (tenantId: number) => {
    try {
      await deleteTenant(tenantId).unwrap()
      // Optionally show a success toast
    } catch (err) {
      console.error("Failed to delete the tenant:", err)
      // Optionally show an error toast
    }
  }

  const handleNextPage = () => {
    if (tenantsResponse?.next) {
      setOffset(offset + PAGE_SIZE)
    }
  }

  const handlePrevPage = () => {
    if (tenantsResponse?.prev) {
      setOffset(offset - PAGE_SIZE)
    }
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
        <div className="text-center text-red-600">Failed to load tenants. Please try again.</div>
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
                onClick={() => setIsModalOpen(true)}
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
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tenantsResponse?.data.map((tenant) => (
          <Card
            key={tenant.tenant_key}
            className="group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 h-full flex flex-col cursor-pointer"
            onClick={() => handleTenantClick(tenant.tenant_key)}
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
                  <Badge className={`${getStatusColor(tenant.tenant_status)} font-medium px-2 py-1 text-xs border`}>
                    {tenant.tenant_status}
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTenantClick(tenant.tenant_key)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(tenant.tenant_key)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Tenant
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(tenant.tenant_id)
                        }}
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
             
              {/* Tags Section */}
              <div className="space-y-2">
                {tenant.bh_tags.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Tag className="h-4 w-4" />
                      <span>Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
                      {tenant.bh_tags
                        .slice(0, 3)
                        .map((tag) => (
                          <Badge
                            key={tag.Key}
                            variant="outline"
                            className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            <span className="font-semibold">{tag.Key}:</span>&nbsp;{truncateText(tag.Value, 12)}
                          </Badge>
                        ))}
                      {tenant.bh_tags.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                        >
                          +{tenant.bh_tags.length - 3}
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
                  {new Date(tenant.created_at).toLocaleDateString("en-US", {
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

      {/* Pagination Controls */}
      {tenantsResponse && tenantsResponse.total > PAGE_SIZE && (
        <div className="flex justify-end items-center gap-4 mt-6">
          <span className="text-sm text-muted-foreground">
            Showing {Math.min(offset + 1, tenantsResponse.total)}-{Math.min(offset + PAGE_SIZE, tenantsResponse.total)} of{" "}
            {tenantsResponse.total}
          </span>
          <Button variant="outline" onClick={handlePrevPage} disabled={!tenantsResponse?.prev}>
            Previous
          </Button>
          <Button variant="outline" onClick={handleNextPage} disabled={!tenantsResponse?.next}>
            Next
          </Button>
        </div>
      )}

      {tenantsResponse?.data.length === 0 && (
        <Card className="col-span-full border-dashed border-2 border-slate-300 dark:border-slate-600">
          <CardContent className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold">No Tenants Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or add a new tenant.</p>
          </CardContent>
        </Card>
      )}

      <TenantCreationModal open={isModalOpen} onOpenChange={() => setIsModalOpen(false)} />
    </div>
  )
}
