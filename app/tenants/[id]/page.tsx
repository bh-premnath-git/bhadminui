"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGetTenantByNameQuery } from "@/lib/services/tenant-api-service"
import {
  ArrowLeft,
  Building2,
  Mail,
  User,
  Tag,
  Calendar,
  Edit,
  Trash2,
  Shield,
  Settings,
  ExternalLink,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TenantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tenantName = params.id as string

  const { data: tenantResponse, isLoading: loading, error } = useGetTenantByNameQuery(tenantName, {
    skip: !tenantName,
  })

  const currentTenant = tenantResponse

  const handleBack = () => {
    router.push("/tenants")
  }

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    console.log("Edit tenant:", currentTenant?.id)
  }

  const handleDelete = () => {
    // Show delete confirmation
    console.log("Delete tenant:", currentTenant?.id)
  }

  // Function to extract tenant identifier from login URL and construct admin URL
  const getAdminUrl = (loginUrl: string): string => {
    try {
      const url = new URL(loginUrl)
      const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0)
      const tenantId = pathSegments[pathSegments.length - 1] // Get the last segment
      return `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/admin/${tenantId}/console/`
    } catch (error) {
      console.error('Error parsing login URL:', error)
      return loginUrl // Fallback to original URL if parsing fails
    }
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
          <div className="text-red-600 mb-4">Failed to load tenant. Please try again.</div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </Button>
        </div>
      </div>
    )
  }

  if (!currentTenant) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">Tenant not found</div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </Button>
        </div>
      </div>
    )
  }

  const appUrl = `${process.env.NEXT_PUBLIC_UI_APP_URL}?kc_realm_id=${currentTenant.kc_realm_id}&kc_client_id=${currentTenant.kc_client_id}&client_key=${currentTenant.client_key}`

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

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{currentTenant.tenant_name}</h1>
            <p className="text-muted-foreground">Tenant Details and Configuration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(currentTenant.tenant_status)} font-medium px-3 py-1 text-sm border`}>
            {currentTenant.tenant_status}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleEdit} variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Tenant</p>
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
                <p>Delete Tenant</p>
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
                <Building2 className="h-5 w-5 text-blue-600" />
                <CardTitle>Basic Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tenant Name</label>
                <p className="text-lg font-semibold">{currentTenant.tenant_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm leading-relaxed">{currentTenant.tenant_description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(currentTenant.tenant_status)} font-medium px-2 py-1 text-xs border`}>
                      {currentTenant.tenant_status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tenant ID</label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">{currentTenant.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                <CardTitle>Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{currentTenant.created_by}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-600" />
                <CardTitle>Tags & Categories</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {currentTenant.bh_tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentTenant.bh_tags.map((tag) => (
                    <Badge
                      key={tag.Key}
                      variant="outline"
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    >
                      <span className="font-semibold">{tag.Key}:</span>&nbsp;<span>{tag.Value}</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tags assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Technical Configuration */}
          <Accordion type="single" collapsible className="w-full rounded-lg border px-4">
            <AccordionItem value="tech-config">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-base">Technical Configuration</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Keycloak Realm ID</label>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">{currentTenant.kc_realm_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Keycloak Client ID</label>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">{currentTenant.kc_client_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Client Key</label>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">{currentTenant.client_key}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Login URL</label>
                  <a 
                    href={getAdminUrl(currentTenant.login_url ?? "")} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1 block hover:bg-muted/80 transition-colors text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Admin URL
                  </a>
                </div> 
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
                  {new Date(currentTenant.created_at).toLocaleDateString("en-US", {
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
                  {new Date(currentTenant.updated_at).toLocaleDateString("en-US", {
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
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <a href={appUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Tenant App
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Tenant
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Tenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
