export interface ObjectPayload {
  name: string
  data: {
    year: number
    price: number
  }
}

export interface CreateObjectResponse {
  id: string
  name: string
  data: {
    year: number
    price: number
  }
  createdAt: string
}

export interface PatchResponse {
  id: string
  name: string
  updatedAt: string
}
