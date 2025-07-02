import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type Keycloak from "keycloak-js"

interface AuthState {
  keycloak: Keycloak | null
  authenticated: boolean
  loading: boolean
  token: string | undefined
  tokenParsed: Keycloak.KeycloakTokenParsed | undefined
}

const initialState: AuthState = {
  keycloak: null,
  authenticated: false,
  loading: true,
  token: undefined,
  tokenParsed: undefined,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setKeycloak: (state, action: PayloadAction<Keycloak>) => {
      state.keycloak = action.payload
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload
      state.loading = false
    },
    setToken: (
      state,
      action: PayloadAction<{
        token: string | undefined
        tokenParsed: Keycloak.KeycloakTokenParsed | undefined
      }>
    ) => {
      state.token = action.payload.token
      state.tokenParsed = action.payload.tokenParsed
    },
    logout: (state) => {
      state.keycloak?.logout()
    },
  },
})

export const { setKeycloak, setAuthenticated, setToken, logout } =
  authSlice.actions

export default authSlice.reducer
