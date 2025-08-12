import { apiService } from "./api-service"
import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  TenantFilters,
  TenantCreationSuccessData,
} from "../types/tenant"
import type { PaginatedResponse } from "../types/api"

export const tenantApiSlice = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query<PaginatedResponse<Tenant>, TenantFilters | void>({
      query: (filters) => ({
        url: "tenants",
        params: filters || {},
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "Tenant" as const, id })), { type: "Tenant", id: "LIST" }]
          : [{ type: "Tenant", id: "LIST" }],
    }),
    getTenantByName: builder.query<Tenant, string>({
      query: (name) => ({
        url: "tenants",
        params: { tenant_key: name, limit: 1 },
      }),
      transformResponse: (response: PaginatedResponse<Tenant>) => {
        if (response.data && response.data.length > 0) {
          return response.data[0]
        }
        throw new Error(`Tenant with name "${name}" not found`)
      },
      providesTags: (_result, _error, name) => [{ type: "Tenant", id: name }],
    }),
    getTenantById: builder.query<Tenant, string>({
      query: (id) => ({
        url: `tenants/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Tenant", id }],
    }),
    createTenant: builder.mutation<TenantCreationSuccessData, CreateTenantRequest>({
      query: (data) => {
        return {
          url: `tenants`,
          method: "POST",
          body: data,
        }
      },
      transformResponse: (response: TenantCreationSuccessData) => response,
      invalidatesTags: [{ type: "Tenant", id: "LIST" }],
    }),
    updateTenant: builder.mutation<Tenant, { id: string; data: Partial<UpdateTenantRequest> }>({
      queryFn: async () => ({ error: { status: 501, data: "Not Implemented" } }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Tenant", id }, { type: "Tenant", id: "LIST" }],
    }),
    deleteTenant: builder.mutation<{ success: boolean; id: number }, number>({
      query: (tenantId) => ({
        url: `tenants?tenant_id=${tenantId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Tenant", id },
        { type: "Tenant", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetTenantsQuery,
  useGetTenantByNameQuery,
  useGetTenantByIdQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} = tenantApiSlice
