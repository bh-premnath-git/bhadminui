import { BaseApiService } from "./base-api-service"
import type { Tenant, CreateTenantRequest, UpdateTenantRequest, TenantFilters } from "../types/tenant"
import type { ApiResponse, PaginatedResponse } from "../types/api"

class TenantApiService extends BaseApiService {
  constructor() {
    super("/api/tenants")
  }

  async getAll(filters?: TenantFilters): Promise<PaginatedResponse<Tenant>> {
    // Simulate API call with dummy data
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

    // Apply filters
    let filteredTenants = dummyTenants
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

  async getById(id: string): Promise<ApiResponse<Tenant>> {
    const allTenants = await this.getAll()
    const tenant = allTenants.data.find((t) => t.id === id)

    if (!tenant) {
      throw this.handleError(new Error("Tenant not found"))
    }

    return {
      data: tenant,
      message: "Tenant retrieved successfully",
      success: true,
    }
  }

  async create(data: CreateTenantRequest): Promise<ApiResponse<Tenant>> {
    const newTenant: Tenant = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return {
      data: newTenant,
      message: "Tenant created successfully",
      success: true,
    }
  }

  async update(id: string, data: Partial<UpdateTenantRequest>): Promise<ApiResponse<Tenant>> {
    const existing = await this.getById(id)
    const updatedTenant: Tenant = {
      ...existing.data,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    return {
      data: updatedTenant,
      message: "Tenant updated successfully",
      success: true,
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    // Simulate deletion
    return {
      data: undefined,
      message: "Tenant deleted successfully",
      success: true,
    }
  }
}

export const tenantApiService = new TenantApiService()
