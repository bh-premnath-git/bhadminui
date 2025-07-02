import { apiService } from "./api-service"
import type { Tenant, CreateTenantRequest, UpdateTenantRequest, TenantFilters } from "../types/tenant"
import type { PaginatedResponse } from "../types/api"

// Dummy data and filtering logic from the original file
const dummyTenants: Tenant[] = [
  {
    id: "1",
    tenant_name: "Acme Corporation",
    tenant_description: "Leading technology company specializing in innovative solutions",
    email: "admin@acme.com",
    first_name: "John",
    last_name: "Doe",
    bh_tags: { industry: "Technology", size: "Large", region: "North America" },
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    tenant_name: "Global Dynamics",
    tenant_description: "International consulting firm with expertise in business transformation",
    email: "contact@globaldynamics.com",
    first_name: "Jane",
    last_name: "Smith",
    bh_tags: { industry: "Consulting", size: "Medium", region: "Europe" },
    status: "active",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    tenant_name: "StartupXYZ",
    tenant_description: "Innovative startup focused on AI and machine learning solutions",
    email: "hello@startupxyz.com",
    first_name: "Mike",
    last_name: "Johnson",
    bh_tags: { industry: "AI/ML", size: "Small", region: "Asia" },
    status: "pending",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
]

const getFilteredTenants = (filters?: TenantFilters): PaginatedResponse<Tenant> => {
  let filteredTenants = [...dummyTenants] // Use a copy to avoid mutation across calls
  if (filters?.status) {
    filteredTenants = filteredTenants.filter((t) => t.status === filters.status)
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filteredTenants = filteredTenants.filter(
      (t) =>
        t.tenant_name.toLowerCase().includes(search) ||
        t.tenant_description.toLowerCase().includes(search) ||
        t.email.toLowerCase().includes(search),
    )
  }

  return {
    data: filteredTenants,
    message: "Tenants retrieved successfully",
    success: true,
    pagination: {
      page: 1,
      limit: 10,
      total: filteredTenants.length,
      totalPages: Math.ceil(filteredTenants.length / 10),
    },
  }
}

export const tenantApiSlice = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query<PaginatedResponse<Tenant>, TenantFilters | void>({
      queryFn: async (filters) => {
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
        return { data: getFilteredTenants(filters || undefined) }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Tenant" as const, id })),
              { type: "Tenant", id: "LIST" },
            ]
          : [{ type: "Tenant", id: "LIST" }],
    }),
    getTenantById: builder.query<Tenant, string>({
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const tenant = dummyTenants.find((t) => t.id === id)
        return tenant ? { data: tenant } : { error: { status: 404, data: "Tenant not found" } }
      },
      providesTags: (_result, _error, id) => [{ type: "Tenant", id }],
    }),
    createTenant: builder.mutation<Tenant, CreateTenantRequest>({
      queryFn: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const newTenant: Tenant = {
          id: Math.random().toString(36).substring(2, 9),
          ...data,
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        dummyTenants.push(newTenant)
        return { data: newTenant }
      },
      invalidatesTags: [{ type: "Tenant", id: "LIST" }],
    }),
    updateTenant: builder.mutation<Tenant, { id: string; data: Partial<UpdateTenantRequest> }>({
      queryFn: async ({ id, data }) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const index = dummyTenants.findIndex((t) => t.id === id)
        if (index !== -1) {
          dummyTenants[index] = { ...dummyTenants[index], ...data, updatedAt: new Date().toISOString() }
          return { data: dummyTenants[index] }
        }
        return { error: { status: 404, data: "Tenant not found" } }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Tenant", id }, { type: "Tenant", id: "LIST" }],
    }),
    deleteTenant: builder.mutation<{ success: boolean; id: string }, string>({
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const index = dummyTenants.findIndex((t) => t.id === id)
        if (index !== -1) {
          dummyTenants.splice(index, 1)
          return { data: { success: true, id } }
        }
        return { error: { status: 404, data: "Tenant not found" } }
      },
      invalidatesTags: (_result, _error, id) => [{ type: "Tenant", id }, { type: "Tenant", id: "LIST" }],
    }),
  }),
})

export const {
  useGetTenantsQuery,
  useGetTenantByIdQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} = tenantApiSlice
