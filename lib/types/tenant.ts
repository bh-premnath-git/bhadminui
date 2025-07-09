import type { BaseEntity } from "./api"

export interface Tag {
  Key: string
  Value: string
}

export interface Tenant extends BaseEntity {
  tenant_name: string
  tenant_key: string
  tenant_description: string
  tenant_logo_path: string
  bh_tags: Tag[]
  tenant_status: "active" | "inactive"
  kc_realm_id: string
  kc_client_id: string
  login_url?: string
  client_key: string
}

export interface CreateTenantRequest {
  tenant_name: string
  tenant_description: string
  email: string
  first_name: string
  last_name: string
  bh_tags: Tag[]
}

export interface UpdateTenantRequest extends Partial<CreateTenantRequest> {
  id: string
}

export interface TenantFilters {
  search?: string
  tenant_status?: "active" | "inactive"
  limit?: number
  offset?: number
  tags?: string[]
}

export interface TenantCreationSuccessData {
  success: boolean
  username: string
  password?: string
  realm_id: string
  client_id: string
  login_url: string
}
