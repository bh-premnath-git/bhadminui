"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { X, Plus, ChevronRight, RotateCcw, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useTenantOnboarding } from "@/hooks/use-tenant-onboarding"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  tenant_name: z.string().min(2, "Tenant name must be at least 2 characters"),
  tenant_description: z.string().min(1, "Tenant description is required"),
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  bh_tags: z.record(z.string()).default({}),
})

type FormData = z.infer<typeof formSchema>

const accordionSections = [
  { id: "basic", title: "Basic Information", required: true },
  { id: "contact", title: "Contact Details", required: true },
  { id: "tags", title: "Tags & Categories", required: false },
]

export function TenantOnboardingForm() {
  const { createTenant, isLoading } = useTenantOnboarding()
  const [tagInput, setTagInput] = useState("")
  const [openSections, setOpenSections] = useState<string[]>(["basic"])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant_name: "",
      tenant_description: "",
      email: "",
      first_name: "",
      last_name: "",
      bh_tags: {},
    },
  })

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]))
  }

  const addTag = () => {
    if (!tagInput.trim()) return

    const currentTags = form.getValues("bh_tags")
    const tagKey = tagInput.trim().toLowerCase().replace(/\s+/g, "_")

    form.setValue("bh_tags", {
      ...currentTags,
      [tagKey]: tagInput.trim(),
    })

    setTagInput("")
  }

  const removeTag = (tagKey: string) => {
    const currentTags = form.getValues("bh_tags")
    const { [tagKey]: removed, ...remainingTags } = currentTags
    form.setValue("bh_tags", remainingTags)
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      await createTenant(data)
      form.reset()
      setTagInput("")
      // Show success message
    } catch (error) {
      console.error("Failed to create tenant:", error)
    }
  }

  const currentTags = form.watch("bh_tags")

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
                          Add tags to categorize and organize this tenant
                        </FormDescription>
                        <div className="space-y-3">
                          {/* Tag Input */}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter a tag..."
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleTagInputKeyDown}
                              className="flex-1 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={addTag}
                              disabled={!tagInput.trim()}
                              className="border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-transparent"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Display Tags */}
                          {Object.keys(currentTags).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(currentTags).map(([key, value]) => (
                                <Badge
                                  key={key}
                                  variant="secondary"
                                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                >
                                  <span className="font-medium">{value}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeTag(key)}
                                    className="ml-1 hover:bg-red-500/20 rounded-full p-0.5 transition-colors group"
                                  >
                                    <X className="h-3 w-3 text-blue-600 dark:text-blue-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}

                          {Object.keys(currentTags).length === 0 && (
                            <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                              <p className="text-sm text-slate-500 dark:text-slate-400">No tags added yet</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                Type a tag name and press Enter
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
              setTagInput("")
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
