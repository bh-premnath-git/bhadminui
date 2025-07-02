import type { BaseEntity } from "./api"

export interface Tenant extends BaseEntity {
  tenant_name: string
  tenant_description: string
  email: string
  first_name: string
  last_name: string
  bh_tags: Record<string, string>
  status: "active" | "inactive" | "pending"
}

export interface CreateTenantRequest {
  tenant_name: string
  tenant_description: string
  email: string
  first_name: string
  last_name: string
  bh_tags: Record<string, string>
}

export interface UpdateTenantRequest extends Partial<CreateTenantRequest> {
  id: string
}

export interface TenantFilters {
  status?: Tenant["status"]
  search?: string
  tags?: string[]
}
