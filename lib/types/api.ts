export interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, any>
}

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}
