"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ChevronRight, Check, Loader2, X, Shield, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  role_id: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const accordionSections = [
  { id: "basic", title: "Basic Information", required: true },
  { id: "contact", title: "Contact Details", required: true },
  { id: "role", title: "Role Association", required: false },
]

// Mock data for roles
const mockRoles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: ["read", "write", "delete", "admin", "manage_users", "manage_tenants", "system_config"],
    tenant: null, // Global role
  },
  {
    id: "2",
    name: "Tenant Admin",
    description: "Administrative access within assigned tenants",
    permissions: ["read", "write", "delete", "manage_users", "tenant_config"],
    tenant: {
      id: "1",
      name: "Acme Corporation",
    },
  },
  {
    id: "3",
    name: "User Manager",
    description: "Specialized role for managing users within tenants",
    permissions: ["read", "write", "manage_users"],
    tenant: {
      id: "2",
      name: "Global Dynamics",
    },
  },
  {
    id: "4",
    name: "Standard User",
    description: "Basic user access with read and limited write permissions",
    permissions: ["read", "write"],
    tenant: {
      id: "1",
      name: "Acme Corporation",
    },
  },
  {
    id: "5",
    name: "Project Manager",
    description: "Project-specific management role",
    permissions: ["read", "write", "manage_projects"],
    tenant: {
      id: "3",
      name: "StartupXYZ",
    },
  },
  {
    id: "6",
    name: "Read Only",
    description: "View-only access for reporting and monitoring",
    permissions: ["read"],
    tenant: {
      id: "2",
      name: "Global Dynamics",
    },
  },
  {
    id: "7",
    name: "System Administrator",
    description: "Global system administration role",
    permissions: ["read", "write", "delete", "admin", "system_config"],
    tenant: null, // Global role
  },
]

interface UserCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: FormData & { tenant_id?: string }) => Promise<void>
}

export function UserCreationModal({ open, onOpenChange, onSubmit }: UserCreationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>(["basic"])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      role_id: "",
    },
  })

  const selectedRoleId = form.watch("role_id")
  const selectedRole = mockRoles.find((role) => role.id === selectedRoleId)

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]))
  }

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      // Include tenant_id from the selected role
      const submitData = {
        ...data,
        tenant_id: selectedRole?.tenant?.id,
      }

      if (onSubmit) {
        await onSubmit(submitData)
      } else {
        // Default behavior - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Creating user:", submitData)
      }

      // Reset form and close modal on success
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.reset()
    setOpenSections(["basic"])
    onOpenChange(false)
  }

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "read":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "write":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "delete":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "manage_users":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in the required information and optionally assign a role.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
            {accordionSections.map((section) => (
              <Collapsible
                key={section.id}
                open={openSections.includes(section.id)}
                onOpenChange={() => toggleSection(section.id)}
                className="group"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className={cn(
                      "flex w-full justify-between items-center p-4 h-auto",
                      "bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50",
                      "hover:from-slate-100 hover:to-slate-200/50 dark:hover:from-slate-700/50 dark:hover:to-slate-800/50",
                      "border border-slate-200/60 dark:border-slate-700/60 rounded-lg",
                      "transition-all duration-200 ease-in-out",
                      "shadow-sm hover:shadow-md",
                      openSections.includes(section.id) &&
                        "bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/60 dark:border-blue-800/60",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors duration-200",
                          openSections.includes(section.id)
                            ? "bg-blue-500 shadow-sm shadow-blue-500/50"
                            : "bg-slate-300 dark:bg-slate-600",
                        )}
                      />
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{section.title}</span>
                          {section.required && (
                            <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-medium">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "transition-transform duration-200 ease-in-out",
                        openSections.includes(section.id) ? "rotate-90" : "rotate-0",
                      )}
                    >
                      <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    </div>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="px-4 pb-4 pt-2">
                  <div className="space-y-4 bg-white/50 dark:bg-slate-900/20 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
                    {section.id === "basic" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                                First Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John"
                                  className="border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                                Last Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Doe"
                                  className="border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {section.id === "contact" && (
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="user@example.com"
                                type="email"
                                className="border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {section.id === "role" && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="role_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                                Select Role
                              </FormLabel>
                              <FormDescription className="text-slate-500 dark:text-slate-400">
                                Choose a role to assign permissions and tenant access. The tenant will be automatically
                                assigned based on the role.
                              </FormDescription>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400">
                                    <SelectValue placeholder="Select a role..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[300px]">
                                  {mockRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.id} className="py-3">
                                      <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                          <Shield className="h-4 w-4 text-purple-600" />
                                          <span className="font-medium">{role.name}</span>
                                          {role.tenant ? (
                                            <Badge variant="outline" className="text-xs">
                                              {role.tenant.name}
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                                              Global
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{role.description}</p>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Role Preview */}
                        {selectedRole && (
                          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-purple-600" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">Role Preview</span>
                              </div>

                              {/* Tenant Association */}
                              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <div className="flex-1">
                                  {selectedRole.tenant ? (
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Tenant Assignment
                                      </p>
                                      <p className="text-sm text-blue-700 dark:text-blue-300">
                                        User will be automatically assigned to{" "}
                                        <span className="font-semibold">{selectedRole.tenant.name}</span>
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                                        Global Role
                                      </p>
                                      <p className="text-sm text-purple-700 dark:text-purple-300">
                                        User will have system-wide access across all tenants
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Permissions */}
                              <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                  Permissions:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {selectedRole.permissions.map((permission) => (
                                    <Badge
                                      key={permission}
                                      variant="secondary"
                                      className={`text-xs px-2 py-1 ${getPermissionColor(permission)}`}
                                    >
                                      {permission.replace("_", " ")}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                {selectedRole.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleClose}
                className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-10 w-10 bg-transparent"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                size="icon"
                className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all duration-200 h-10 w-10"
                title={isLoading ? "Creating user..." : "Create user"}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
