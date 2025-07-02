"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks"
import { createTenant } from "@/lib/features/tenant/tenant-slice"
import type { CreateTenantRequest } from "@/lib/types/tenant"

interface TenantData {
  tenant_name: string
  tenant_description: string
  email: string
  first_name: string
  last_name: string
  bh_tags: Record<string, string>
}

export function useTenantOnboarding() {
  const dispatch = useAppDispatch()
  const { loading: isLoading, error: tenantError } = useAppSelector((state) => state.tenant)
  const [error, setError] = useState<string | null>(null)

  const createTenantHandler = async (data: CreateTenantRequest) => {
    setError(null)
    const result = await dispatch(createTenant(data))
    if (createTenant.fulfilled.match(result)) {
      return result.payload
    } else {
      setError(tenantError || "Failed to create tenant")
      throw new Error(tenantError || "Failed to create tenant")
    }
  }

  const updateTenant = async (id: string, data: Partial<TenantData>) => {
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Updating tenant:", id, data)

      return {
        id,
        ...data,
        updatedAt: new Date().toISOString(),
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update tenant"
      setError(errorMessage)
      throw err
    }
  }

  const deleteTenant = async (id: string) => {
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Deleting tenant:", id)

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete tenant"
      setError(errorMessage)
      throw err
    }
  }

  return {
    createTenant: createTenantHandler,
    updateTenant,
    deleteTenant,
    isLoading,
    error,
  }
}
