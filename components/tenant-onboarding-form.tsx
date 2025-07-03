"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { X, Plus, ChevronRight, RotateCcw, Check, Loader2, CheckCircle, ExternalLink, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useTenantOnboarding } from "@/hooks/use-tenant-onboarding"
import { cn } from "@/lib/utils"
import { TenantCreationSuccessData } from "@/lib/types/tenant"

const formSchema = z.object({
  tenant_name: z.string().min(2, "Tenant name must be at least 2 characters"),
  tenant_description: z.string().min(1, "Tenant description is required"),
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  bh_tags: z.array(
    z.object({
      key: z.string().min(1, "Tag key cannot be empty"),
      value: z.string().min(1, "Tag value cannot be empty"),
    }),
  ),
})

type FormData = z.infer<typeof formSchema>

const accordionSections = [
  { id: "basic", title: "Basic Information", required: true },
  { id: "contact", title: "Contact Details", required: true },
  { id: "tags", title: "Tags & Categories", required: false },
]

export function TenantOnboardingForm() {
  const { createTenant, isLoading } = useTenantOnboarding()
  const [tagKeyInput, setTagKeyInput] = useState("")
  const [tagValueInput, setTagValueInput] = useState("")
  const [openSections, setOpenSections] = useState<string[]>(["basic"])
  const [creationSuccessData, setCreationSuccessData] = useState<TenantCreationSuccessData | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant_name: "",
      tenant_description: "",
      email: "",
      first_name: "",
      last_name: "",
      bh_tags: [],
    },
  })

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => (prev.includes(sectionId) ? [] : [sectionId]))
  }

  const addTag = () => {
    const key = tagKeyInput.trim()
    const value = tagValueInput.trim()
    if (!key || !value) return

    const currentTags = form.getValues("bh_tags")
    if (currentTags.some((tag) => tag.key === key)) {
      form.setError("bh_tags", { type: "manual", message: "Tag keys must be unique." })
      return
    }
    form.clearErrors("bh_tags")

    form.setValue("bh_tags", [...currentTags, { key, value }])

    setTagKeyInput("")
    setTagValueInput("")
  }

  const removeTag = (keyToRemove: string) => {
    const currentTags = form.getValues("bh_tags")
    form.setValue(
      "bh_tags",
      currentTags.filter((tag) => tag.key !== keyToRemove),
    )
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      // Automatically add any un-added tag from the input fields before submitting
      const key = tagKeyInput.trim()
      const value = tagValueInput.trim()
      let finalData = data

      if (key && value) {
        if (data.bh_tags.some((tag) => tag.key === key)) {
          form.setError("bh_tags", {
            type: "manual",
            message: "You have an un-added tag with a duplicate key. Please resolve it before submitting.",
          })
          return // Stop submission
        }
        finalData = {
          ...data,
          bh_tags: [...data.bh_tags, { key, value }],
        }
      }

      const response: any = await createTenant(finalData)
      if (response) {
        setCreationSuccessData(response)
        form.reset()
        setTagKeyInput("")
        setTagValueInput("")
      }
    } catch (error) {
      console.error("Failed to create tenant:", error)
      // You could add a toast notification here to show the error
    }
  }

  const currentTags = form.watch("bh_tags")

  if (creationSuccessData) {
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
      // You could show a "Copied!" toast notification here
    }

    return (
      <div className="flex flex-col items-center text-center p-4 sm:p-6">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tenant Created!</h3>
        <p className="text-muted-foreground mt-2 mb-6">
          The tenant has been successfully onboarded. Here are the admin credentials.
        </p>

        <div className="w-full max-w-md space-y-4 rounded-lg border bg-slate-50 dark:bg-slate-800/50 p-6 text-left">
          <div className="flex justify-between items-center">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <p className="font-mono text-lg">{creationSuccessData.username}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(creationSuccessData.username)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {creationSuccessData.password && (
            <div className="flex justify-between items-center">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <p className="font-mono text-lg">{creationSuccessData.password}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(creationSuccessData.password!)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="w-full max-w-md mt-6 space-y-3">
          <a href={creationSuccessData.login_url} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="mr-2 h-4 w-4" />
              Go to Login Page
            </Button>
          </a>
          <Button variant="outline" className="w-full" onClick={() => setCreationSuccessData(null)}>
            Create Another Tenant
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {accordionSections.map((section) => (
          <Collapsible
            key={section.id}
            open={openSections.includes(section.id)}
            onOpenChange={() => toggleSection(section.id)}
            className="group"
          >
            <CollapsibleTrigger asChild>
              <Button
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
                  <>
                    <FormField
                      control={form.control}
                      name="tenant_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Tenant Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Acme Corporation"
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
                      name="tenant_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of the tenant organization..."
                              className="resize-none border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {section.id === "contact" && (
                  <>
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
                              placeholder="admin@acme.com"
                              type="email"
                              className="border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">First Name</FormLabel>
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
                            <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Last Name</FormLabel>
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
                  </>
                )}

                {section.id === "tags" && (
                  <FormField
                    control={form.control}
                    name="bh_tags"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Tags</FormLabel>
                        <FormDescription className="text-slate-500 dark:text-slate-400">
                          Add key-value tags to categorize and organize this tenant
                        </FormDescription>
                        <div className="space-y-3">
                          {/* Tag Input */}
                          <div className="flex items-start gap-2">
                            <Input
                              placeholder="Tag key (e.g., 'department')"
                              value={tagKeyInput}
                              onChange={(e) => setTagKeyInput(e.target.value)}
                              className="flex-1 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                            />
                            <Input
                              placeholder="Tag value (e.g., 'Engineering')"
                              value={tagValueInput}
                              onChange={(e) => setTagValueInput(e.target.value)}
                              onKeyDown={handleTagInputKeyDown}
                              className="flex-1 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={addTag}
                              disabled={!tagKeyInput.trim() || !tagValueInput.trim()}
                              className="border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-transparent shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Display Tags */}
                          {currentTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {currentTags.map((tag) => (
                                <Badge
                                  key={tag.key}
                                  variant="secondary"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                >
                                  <span className="font-semibold">{tag.key}:</span>
                                  <span className="font-normal">{tag.value}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeTag(tag.key)}
                                    className="ml-1 hover:bg-red-500/20 rounded-full p-0.5 transition-colors group"
                                  >
                                    <X className="h-3 w-3 text-blue-600 dark:text-blue-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}

                          {currentTags.length === 0 && (
                            <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                              <p className="text-sm text-slate-500 dark:text-slate-400">No tags added yet</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                Enter a key and value, then press Enter or click the add button
                              </p>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            onClick={() => {
              form.reset()
              setTagKeyInput("")
              setTagValueInput("")
            }}
            className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-10 w-10"
            title="Reset form"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            size="icon"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-10 w-10"
            title={isLoading ? "Creating tenant..." : "Create tenant"}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </Form>
  )
}
