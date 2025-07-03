import { apiService } from "./api-service"
import type { Role, CreateRoleRequest, UpdateRoleRequest, RoleFilters } from "../types/role"
import type { PaginatedResponse } from "../types/api"

// Dummy data from the original file
const dummyRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description:
      "Full system access with all permissions including user management, system configuration, and data administration",
    permissions: ["read", "write", "delete", "admin", "manage_users", "manage_tenants", "system_config"],
    userCount: 2,
    status: "active",
    tenant: null, // Global role
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Tenant Admin",
    description:
      "Administrative access within assigned tenants with user management and configuration capabilities",
    permissions: ["read", "write", "delete", "manage_users", "tenant_config"],
    userCount: 3,
    status: "active",
    tenant: {
      id: "1",
      name: "Acme Corporation",
    },
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "3",
    name: "User Manager",
    description: "Specialized role for managing users within tenants with limited administrative privileges",
    permissions: ["read", "write", "manage_users"],
    userCount: 2,
    status: "active",
    tenant: {
      id: "2",
      name: "Global Dynamics",
    },
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-18T09:15:00Z",
  },
  {
    id: "4",
    name: "Standard User",
    description: "Basic user access with read and limited write permissions for standard operations",
    permissions: ["read", "write"],
    userCount: 8,
    status: "active",
    tenant: {
      id: "1",
      name: "Acme Corporation",
    },
    createdAt: "2024-01-20T11:45:00Z",
    updatedAt: "2024-01-20T11:45:00Z",
  },
  {
    id: "5",
    name: "Project Manager",
    description: "Project-specific management role with enhanced permissions for project coordination",
    permissions: ["read", "write", "manage_projects"],
    userCount: 4,
    status: "active",
    tenant: {
      id: "3",
      name: "StartupXYZ",
    },
    createdAt: "2024-01-22T16:20:00Z",
    updatedAt: "2024-01-22T16:20:00Z",
  },
  {
    id: "6",
    name: "Read Only",
    description: "View-only access for reporting and monitoring purposes without modification capabilities",
    permissions: ["read"],
    userCount: 5,
    status: "active",
    tenant: {
      id: "2",
      name: "Global Dynamics",
    },
    createdAt: "2024-01-22T16:20:00Z",
    updatedAt: "2024-01-22T16:20:00Z",
  },
  {
    id: "7",
    name: "Guest",
    description: "Limited temporary access for external users and contractors",
    permissions: ["read"],
    userCount: 10,
    status: "inactive",
    tenant: null,
    createdAt: "2024-01-23T09:00:00Z",
    updatedAt: "2024-01-23T09:00:00Z",
  },
]

export const roleApiSlice = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<PaginatedResponse<Role>, RoleFilters | void>({
      queryFn: (arg) => {
        const filters = arg || {}
        let roles = [...dummyRoles]
        const { search, status, tenant_id, limit = 10, offset = 0 } = filters

        if (search) {
          const lowercasedSearch = search.toLowerCase()
          roles = roles.filter(
            (r) =>
              r.name.toLowerCase().includes(lowercasedSearch) ||
              r.description.toLowerCase().includes(lowercasedSearch) ||
              (r.tenant && r.tenant.name.toLowerCase().includes(lowercasedSearch)),
          )
        }

        if (status) {
          roles = roles.filter((r) => r.status === status)
        }

        if (tenant_id) {
          if (tenant_id === "global") {
            roles = roles.filter((r) => !r.tenant)
          } else {
            roles = roles.filter((r) => r.tenant?.id === tenant_id)
          }
        }

        const total = roles.length
        const data = roles.slice(offset, offset + limit)

        const response: PaginatedResponse<Role> = {
          total,
          next: offset + limit < total,
          prev: offset > 0,
          offset,
          limit,
          data,
        }
        return { data: response }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Role" as const, id })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),
    getRoleById: builder.query<Role, string>({
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const role = dummyRoles.find((r) => r.id === id)
        return role ? { data: role } : { error: { status: 404, data: "Role not found" } }
      },
      providesTags: (_result, _error, id) => [{ type: "Role", id }],
    }),
    createRole: builder.mutation<Role, CreateRoleRequest>({
      queryFn: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const newRole: Role = {
          id: Math.random().toString(36).substring(2, 9),
          ...data,
          userCount: 0,
          status: "active",
          tenant: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        dummyRoles.push(newRole)
        return { data: newRole }
      },
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),
    updateRole: builder.mutation<Role, { id: string; data: Partial<UpdateRoleRequest> }>({
      queryFn: async ({ id, data }) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const index = dummyRoles.findIndex((r) => r.id === id)
        if (index !== -1) {
          dummyRoles[index] = { ...dummyRoles[index], ...data, updatedAt: new Date().toISOString() }
          return { data: dummyRoles[index] }
        }
        return { error: { status: 404, data: "Role not found" } }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Role", id }, { type: "Role", id: "LIST" }],
    }),
    deleteRole: builder.mutation<{ success: boolean; id: string }, string>({
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const index = dummyRoles.findIndex((r) => r.id === id)
        if (index !== -1) {
          dummyRoles.splice(index, 1)
          return { data: { success: true, id } }
        }
        return { error: { status: 404, data: "Role not found" } }
      },
      invalidatesTags: (_result, _error, id) => [{ type: "Role", id }, { type: "Role", id: "LIST" }],
    }),
  }),
})

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApiSlice
