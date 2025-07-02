import { BaseApiService } from "./base-api-service"
import type { User, CreateUserRequest, UpdateUserRequest, UserFilters } from "../types/user"
import type { ApiResponse, PaginatedResponse } from "../types/api"

class UserApiService extends BaseApiService<User, CreateUserRequest, UpdateUserRequest, UserFilters> {
  constructor() {
    super("/api/users")
  }

  async getAll(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    // Simulate API call with dummy data
    const dummyUsers: User[] = [
      {
        id: "1",
        email: "admin@acme.com",
        first_name: "John",
        last_name: "Doe",
        role: "admin",
        tenant_id: "1",
        status: "active",
        last_login: "2024-01-20T10:30:00Z",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T10:30:00Z",
      },
      {
        id: "2",
        email: "user@acme.com",
        first_name: "Alice",
        last_name: "Wilson",
        role: "user",
        tenant_id: "1",
        status: "active",
        last_login: "2024-01-19T15:45:00Z",
        createdAt: "2024-01-16T11:00:00Z",
        updatedAt: "2024-01-19T15:45:00Z",
      },
      {
        id: "3",
        email: "contact@globaldynamics.com",
        first_name: "Jane",
        last_name: "Smith",
        role: "admin",
        tenant_id: "2",
        status: "active",
        last_login: "2024-01-18T09:20:00Z",
        createdAt: "2024-01-10T14:30:00Z",
        updatedAt: "2024-01-18T09:20:00Z",
      },
      {
        id: "4",
        email: "viewer@startupxyz.com",
        first_name: "Bob",
        last_name: "Brown",
        role: "viewer",
        tenant_id: "3",
        status: "pending",
        createdAt: "2024-01-20T09:15:00Z",
        updatedAt: "2024-01-20T09:15:00Z",
      },
    ]

    // Apply filters
    let filteredUsers = dummyUsers
    if (filters?.role) {
      filteredUsers = filteredUsers.filter((u) => u.role === filters.role)
    }
    if (filters?.status) {
      filteredUsers = filteredUsers.filter((u) => u.status === filters.status)
    }
    if (filters?.tenant_id) {
      filteredUsers = filteredUsers.filter((u) => u.tenant_id === filters.tenant_id)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.email.toLowerCase().includes(search) ||
          u.first_name.toLowerCase().includes(search) ||
          u.last_name.toLowerCase().includes(search),
      )
    }

    return {
      data: filteredUsers,
      message: "Users retrieved successfully",
      success: true,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / 10),
      },
    }
  }

  async getById(id: string): Promise<ApiResponse<User>> {
    const allUsers = await this.getAll()
    const user = allUsers.data.find((u) => u.id === id)

    if (!user) {
      throw this.handleError(new Error("User not found"))
    }

    return {
      data: user,
      message: "User retrieved successfully",
      success: true,
    }
  }

  async create(data: CreateUserRequest): Promise<ApiResponse<User>> {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return {
      data: newUser,
      message: "User created successfully",
      success: true,
    }
  }

  async update(id: string, data: Partial<UpdateUserRequest>): Promise<ApiResponse<User>> {
    const existing = await this.getById(id)
    const updatedUser: User = {
      ...existing.data,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    return {
      data: updatedUser,
      message: "User updated successfully",
      success: true,
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    // Simulate deletion
    return {
      data: undefined,
      message: "User deleted successfully",
      success: true,
    }
  }
}

export const userApiService = new UserApiService()
