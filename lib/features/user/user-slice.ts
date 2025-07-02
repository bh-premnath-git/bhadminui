import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { userApiService } from "../../services/user-api-service"
import type { User, CreateUserRequest, UserFilters } from "../../types/user"

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
  filters: UserFilters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const initialState: UserState = {
  users: [],
  currentUser: null,
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
export const fetchUsers = createAsyncThunk("user/fetchUsers", async (filters?: UserFilters) => {
  const response = await userApiService.getAll(filters)
  return response
})

export const fetchUserById = createAsyncThunk("user/fetchUserById", async (id: string) => {
  const response = await userApiService.getById(id)
  return response.data
})

export const createUser = createAsyncThunk("user/createUser", async (data: CreateUserRequest) => {
  const response = await userApiService.create(data)
  return response.data
})

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, data }: { id: string; data: Partial<CreateUserRequest> }) => {
    const response = await userApiService.update(id, data)
    return response.data
  },
)

export const deleteUser = createAsyncThunk("user/deleteUser", async (id: string) => {
  await userApiService.delete(id)
  return id
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<UserFilters>) => {
      state.filters = action.payload
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch users"
      })
      // Fetch user by ID
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.unshift(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create user"
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload)
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null
        }
      })
  },
})

export const { setFilters, clearCurrentUser, clearError } = userSlice.actions
export default userSlice.reducer
