import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { apiService } from "./services/api-service"
import tenantSlice from "./features/tenant/tenant-slice"
import userSlice from "./features/user/user-slice"
import roleSlice from "./features/role/role-slice"
import authSlice from "./features/auth/auth-slice"

export const store = configureStore({
  reducer: {
    [apiService.reducerPath]: apiService.reducer,
    tenant: tenantSlice,
    user: userSlice,
    role: roleSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          apiService.util.resetApiState.type,
          "auth/setKeycloak",
        ],
        ignoredPaths: ["auth.keycloak"],
      },
    }).concat(apiService.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
