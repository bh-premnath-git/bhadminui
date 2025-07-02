"use client"

import {
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} from "@/lib/services/tenant-api-service"
import type { CreateTenantRequest, UpdateTenantRequest } from "@/lib/types/tenant"

export function useTenantOnboarding() {
  const [createTenantMutation, { isLoading: isCreating, error: createError }] = useCreateTenantMutation()
  const [updateTenantMutation, { isLoading: isUpdating, error: updateError }] = useUpdateTenantMutation()
  const [deleteTenantMutation, { isLoading: isDeleting, error: deleteError }] = useDeleteTenantMutation()

  const createTenant = async (data: CreateTenantRequest) => {
    // The `unwrap` call will automatically throw an error on failure, which can be caught in the component
    return createTenantMutation(data).unwrap()
  }

  const updateTenant = async (id: string, data: Partial<UpdateTenantRequest>) => {
    return updateTenantMutation({ id, data }).unwrap()
  }

  const deleteTenant = async (id: string) => {
    return deleteTenantMutation(id).unwrap()
  }

  const isLoading = isCreating || isUpdating || isDeleting
  const error = createError || updateError || deleteError

  return {
    createTenant,
    updateTenant,
    deleteTenant,
    isLoading,
    error: error ? (error as any).data?.message || "An unknown error occurred" : null,
  }
}
