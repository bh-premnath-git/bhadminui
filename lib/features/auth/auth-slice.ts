import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import type Keycloak from "keycloak-js"

interface AuthState {
  keycloak: Keycloak | null
  authenticated: boolean
  loading: boolean
  token: string | undefined
  tokenParsed: Keycloak.KeycloakTokenParsed | undefined
  clienttoken: string | null
  clienttokenLoading: boolean
  clienttokenError: any | null
}

const initialState: AuthState = {
  keycloak: null,
  authenticated: false,
  loading: true,
  token: undefined,
  tokenParsed: undefined,
  clienttoken: null,
  clienttokenLoading: false,
  clienttokenError: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(generateToken.pending, (state) => {
        state.clienttokenLoading = true
        state.clienttokenError = null
      })
      .addCase(generateToken.fulfilled, (state, action) => {
        state.clienttokenLoading = false
        state.clienttoken = action.payload.access_token.access_token
      })
      .addCase(generateToken.rejected, (state, action) => {
        state.clienttokenLoading = false
        state.clienttokenError = action.payload
      })
  },
})

export const { setKeycloak, setAuthenticated, setToken, logout } =
  authSlice.actions

export const generateToken = createAsyncThunk(
  "auth/generateToken",
  async (token: string | undefined, { rejectWithValue }) => {
    if (!token) {
      return rejectWithValue("No token available");
    }

    try {
      const response = await fetch("/api/auth/generate-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error: any) {
      console.error("API Fetch Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export default authSlice.reducer
