import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { tenantApiSlice } from "../../services/tenant-api-service"
import type { Tenant, TenantFilters } from "../../types/tenant"

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
      // Matchers for getTenants query
      .addMatcher(tenantApiSlice.endpoints.getTenants.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(tenantApiSlice.endpoints.getTenants.matchFulfilled, (state, action) => {
        state.loading = false
        state.tenants = action.payload.data
        // Map PaginatedResponse properties to pagination state
        const currentPage = Math.floor(action.payload.offset / action.payload.limit) + 1
        const totalPages = Math.ceil(action.payload.total / action.payload.limit)
        
        state.pagination = {
          page: currentPage,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: totalPages,
        }
      })
      .addMatcher(tenantApiSlice.endpoints.getTenants.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch tenants"
      })
      // Matcher for getTenantById query
      .addMatcher(tenantApiSlice.endpoints.getTenantById.matchFulfilled, (state, action) => {
        state.currentTenant = action.payload
      })
      // Optimistic update for deleteTenant mutation
      .addMatcher(tenantApiSlice.endpoints.deleteTenant.matchFulfilled, (state, action) => {
        // The second argument to matchFulfilled is the action, payload is the first argument to the original thunk
        const deletedTenantId = action.meta.arg.originalArgs
        state.tenants = state.tenants.filter((tenant) => tenant.id !== deletedTenantId)
      })
  },
})

export const { setFilters, clearCurrentTenant, clearError } = tenantSlice.actions

export default tenantSlice.reducer
