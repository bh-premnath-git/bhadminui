import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { tenantApiService } from "../../services/tenant-api-service"
import type { Tenant, CreateTenantRequest, TenantFilters } from "../../types/tenant"

interface TenantState {
  tenants: Tenant[]
  currentTenant: Tenant | null
  loading: boolean
  error: string | null
  filters: TenantFilters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const initialState: TenantState = {
  tenants: [],
  currentTenant: null,
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
export const fetchTenants = createAsyncThunk("tenant/fetchTenants", async (filters?: TenantFilters) => {
  const response = await tenantApiService.getAll(filters)
  return response
})

export const fetchTenantById = createAsyncThunk("tenant/fetchTenantById", async (id: string) => {
  const response = await tenantApiService.getById(id)
  return response.data
})

export const createTenant = createAsyncThunk("tenant/createTenant", async (data: CreateTenantRequest) => {
  const response = await tenantApiService.create(data)
  return response.data
})

export const updateTenant = createAsyncThunk(
  "tenant/updateTenant",
  async ({ id, data }: { id: string; data: Partial<CreateTenantRequest> }) => {
    const response = await tenantApiService.update(id, data)
    return response.data
  },
)

export const deleteTenant = createAsyncThunk("tenant/deleteTenant", async (id: string) => {
  await tenantApiService.delete(id)
  return id
})

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TenantFilters>) => {
      state.filters = action.payload
    },
    clearCurrentTenant: (state) => {
      state.currentTenant = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tenants
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false
        state.tenants = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch tenants"
      })
      // Fetch tenant by ID
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.currentTenant = action.payload
      })
      // Create tenant
      .addCase(createTenant.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.loading = false
        state.tenants.unshift(action.payload)
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create tenant"
      })
      // Update tenant
      .addCase(updateTenant.fulfilled, (state, action) => {
        const index = state.tenants.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.tenants[index] = action.payload
        }
        if (state.currentTenant?.id === action.payload.id) {
          state.currentTenant = action.payload
        }
      })
      // Delete tenant
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.tenants = state.tenants.filter((t) => t.id !== action.payload)
        if (state.currentTenant?.id === action.payload) {
          state.currentTenant = null
        }
      })
  },
})

export const { setFilters, clearCurrentTenant, clearError } = tenantSlice.actions
export default tenantSlice.reducer
