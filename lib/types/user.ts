import type { BaseEntity } from "./api"

export interface User extends BaseEntity {
  email: string
  first_name: string
  last_name: string
  role: "admin" | "user" | "viewer"
  tenant_id?: string
  status: "active" | "inactive" | "pending"
  last_login?: string
}

export interface CreateUserRequest {
  email: string
  first_name: string
  last_name: string
  role: User["role"]
  tenant_id?: string
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string
}

export interface UserFilters {
  search?: string
  role?: "admin" | "user" | "viewer"
  status?: "active" | "pending" | "inactive"
  tenant_id?: string
  limit?: number
  offset?: number
}
