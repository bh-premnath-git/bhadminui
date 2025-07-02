import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { apiService } from "./services/api-service"
import authSlice from "./features/auth/auth-slice"

export const store = configureStore({
  reducer: {
    [apiService.reducerPath]: apiService.reducer,
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
