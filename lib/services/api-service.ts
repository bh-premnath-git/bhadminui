import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { tenantApiService } from "./tenant-api-service"
import { userApiService } from "./user-api-service"
import { roleApiService } from "./role-api-service"

export const apiService = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Tenant", "User", "Role"],
  endpoints: () => ({}),
})

// Export service instances for direct use
export { tenantApiService, userApiService, roleApiService }
