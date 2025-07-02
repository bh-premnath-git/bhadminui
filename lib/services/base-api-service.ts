import type { ApiResponse, PaginatedResponse, ApiError } from "../types/api"

export abstract class BaseApiService<EntityType, CreateType, UpdateType, FilterType = Record<string, any>> {
  protected baseUrl: string
  protected headers: Record<string, string>

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
    this.headers = {
      "Content-Type": "application/json",
    }
  }

  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const config: RequestInit = {
        headers: { ...this.headers, ...options.headers },
        ...options,
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      throw this.handleError(error)
    }
  }

  protected handleError(error: any): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: "NETWORK_ERROR",
        details: { originalError: error.name },
      }
    }
    return {
      message: "An unknown error occurred",
      code: "UNKNOWN_ERROR",
    }
  }

  // CRUD operations interface
  abstract getAll(filters?: FilterType): Promise<PaginatedResponse<EntityType>>
  abstract getById(id: string): Promise<ApiResponse<EntityType>>
  abstract create(data: CreateType): Promise<ApiResponse<EntityType>>
  abstract update(id: string, data: Partial<UpdateType>): Promise<ApiResponse<EntityType>>
  abstract delete(id: string): Promise<ApiResponse<void>>
}
