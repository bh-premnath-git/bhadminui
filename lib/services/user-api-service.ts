import { apiService } from "./api-service"
import type { User, CreateUserRequest, UpdateUserRequest, UserFilters } from "../types/user"
import type { PaginatedResponse } from "../types/api"

// Dummy data from the original file
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

const getFilteredUsers = (filters?: UserFilters): PaginatedResponse<User> => {
  let filteredUsers = [...dummyUsers]
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

export const userApiSlice = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, UserFilters | void>({
      queryFn: async (filters) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return { data: getFilteredUsers(filters || undefined) }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getUserById: builder.query<User, string>({
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const user = dummyUsers.find((u) => u.id === id)
        return user ? { data: user } : { error: { status: 404, data: "User not found" } }
      },
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<User, CreateUserRequest>({
      queryFn: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          ...data,
          status: "active",
          last_login: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        dummyUsers.push(newUser)
        return { data: newUser }
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation<User, { id: string; data: Partial<UpdateUserRequest> }>({
      queryFn: async ({ id, data }) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const index = dummyUsers.findIndex((u) => u.id === id)
        if (index !== -1) {
          dummyUsers[index] = { ...dummyUsers[index], ...data, updatedAt: new Date().toISOString() }
          return { data: dummyUsers[index] }
        }
        return { error: { status: 404, data: "User not found" } }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }, { type: "User", id: "LIST" }],
    }),
    deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const index = dummyUsers.findIndex((u) => u.id === id)
        if (index !== -1) {
          dummyUsers.splice(index, 1)
          return { data: { success: true, id } }
        }
        return { error: { status: 404, data: "User not found" } }
      },
      invalidatesTags: (_result, _error, id) => [{ type: "User", id }, { type: "User", id: "LIST" }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice
