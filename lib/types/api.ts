export interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  total: number
  next: boolean
  prev: boolean
  offset: number
  limit: number
  data: T[]
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
  created_by: string
  updated_by: string | null
  is_deleted: boolean
  deleted_by: string | null
}
