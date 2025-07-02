import { BaseApiService } from "./base-api-service"
import type { Role, CreateRoleRequest, UpdateRoleRequest, RoleFilters } from "../types/role"
import type { ApiResponse, PaginatedResponse } from "../types/api"

class RoleApiService extends BaseApiService {
  constructor() {
    super("/api/roles")
  }

  async getAll(filters?: RoleFilters): Promise<PaginatedResponse<Role>> {
    // Simulate API call with dummy data
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
        userCount: 2,
        status: "inactive",
        tenant: {
          id: "3",
          name: "StartupXYZ",
        },
        createdAt: "2024-01-25T08:30:00Z",
        updatedAt: "2024-01-25T08:30:00Z",
      },
      {
        id: "8",
        name: "System Administrator",
        description: "Global system administration role with cross-tenant management capabilities",
        permissions: ["read", "write", "delete", "admin", "system_config"],
        userCount: 1,
        status: "active",
        tenant: null, // Global role
        createdAt: "2024-01-26T10:15:00Z",
        updatedAt: "2024-01-26T10:15:00Z",
      },
    ]

    // Apply filters
    let filteredRoles = dummyRoles
    if (filters?.status) {
      filteredRoles = filteredRoles.filter((r) => r.status === filters.status)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filteredRoles = filteredRoles.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search) ||
          (r.tenant && r.tenant.name.toLowerCase().includes(search)),
      )
    }
    if (filters?.tenant_id) {
      if (filters.tenant_id === "global") {
        filteredRoles = filteredRoles.filter((r) => !r.tenant)
      } else {
        filteredRoles = filteredRoles.filter((r) => r.tenant?.id === filters.tenant_id)
      }
    }

    return {
      data: filteredRoles,
      message: "Roles retrieved successfully",
      success: true,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredRoles.length,
        totalPages: Math.ceil(filteredRoles.length / 10),
      },
    }
  }

  async getById(id: string): Promise<ApiResponse<Role>> {
    const allRoles = await this.getAll()
    const role = allRoles.data.find((r) => r.id === id)

    if (!role) {
      throw this.handleError(new Error("Role not found"))
    }

    return {
      data: role,
      message: "Role retrieved successfully",
      success: true,
    }
  }

  async create(data: CreateRoleRequest): Promise<ApiResponse<Role>> {
    const newRole: Role = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      userCount: 0,
      status: "active",
      tenant: data.tenant_id
        ? {
            id: data.tenant_id,
            name: "Mock Tenant", // In real app, would fetch tenant name
          }
        : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return {
      data: newRole,
      message: "Role created successfully",
      success: true,
    }
  }

  async update(id: string, data: Partial<UpdateRoleRequest>): Promise<ApiResponse<Role>> {
    const existing = await this.getById(id)
    const updatedRole: Role = {
      ...existing.data,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    return {
      data: updatedRole,
      message: "Role updated successfully",
      success: true,
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    // Simulate deletion
    return {
      data: undefined,
      message: "Role deleted successfully",
      success: true,
    }
  }
}

export const roleApiService = new RoleApiService()
