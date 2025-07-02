import type { BaseEntity } from "./api"

export interface Role extends BaseEntity {
  name: string
  description: string
  permissions: string[]
  userCount: number
  status: "active" | "inactive"
  tenant: {
    id: string
    name: string
  } | null // null for global roles
}

export interface CreateRoleRequest {
  name: string
  description: string
  permissions: string[]
  tenant_id?: string // optional for global roles
}

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  id: string
}

export interface RoleFilters {
  status?: Role["status"]
  search?: string
  tenant_id?: string // for filtering by specific tenant or "global"
}
