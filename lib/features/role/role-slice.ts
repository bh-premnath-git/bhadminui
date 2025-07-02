import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { roleApiService } from "../../services/role-api-service"
import type { Role, CreateRoleRequest, RoleFilters } from "../../types/role"

interface RoleState {
  roles: Role[]
  currentRole: Role | null
  loading: boolean
  error: string | null
  filters: RoleFilters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const initialState: RoleState = {
  roles: [],
  currentRole: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
}

// Async thunks
export const fetchRoles = createAsyncThunk("role/fetchRoles", async (filters?: RoleFilters) => {
  const response = await roleApiService.getAll(filters)
  return response
})

export const fetchRoleById = createAsyncThunk("role/fetchRoleById", async (id: string) => {
  const response = await roleApiService.getById(id)
  return response.data
})

export const createRole = createAsyncThunk("role/createRole", async (data: CreateRoleRequest) => {
  const response = await roleApiService.create(data)
  return response.data
})

export const updateRole = createAsyncThunk(
  "role/updateRole",
  async ({ id, data }: { id: string; data: Partial<CreateRoleRequest> }) => {
    const response = await roleApiService.update(id, data)
    return response.data
  },
)

export const deleteRole = createAsyncThunk("role/deleteRole", async (id: string) => {
  await roleApiService.delete(id)
  return id
})

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<RoleFilters>) => {
      state.filters = action.payload
    },
    clearCurrentRole: (state) => {
      state.currentRole = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false
        state.roles = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch roles"
      })
      // Fetch role by ID
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.currentRole = action.payload
      })
      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false
        state.roles.unshift(action.payload)
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create role"
      })
      // Update role
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.roles[index] = action.payload
        }
        if (state.currentRole?.id === action.payload.id) {
          state.currentRole = action.payload
        }
      })
      // Delete role
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((r) => r.id !== action.payload)
        if (state.currentRole?.id === action.payload) {
          state.currentRole = null
        }
      })
  },
})

export const { setFilters, clearCurrentRole, clearError } = roleSlice.actions
export default roleSlice.reducer
