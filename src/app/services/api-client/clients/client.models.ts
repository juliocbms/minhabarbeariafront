export interface SaveCLientRequest {
  email: string
  name: string
  password: string
  phone: string
  role: string
}

export interface UpdateCLientRequest {
  email: string
  name: string
  password: string
  phone: string
  role: string
}

export interface SaveCLientResponse {
  id: number
  email: string
  name: string
  password: string
  phone: string
  role: string
}

export interface UpdateCLientResponse {
  id: number
  email: string
  name: string
  password: string
  phone: string
  role: string
}

export interface ListCLientResponse {
  id: number
  email: string
  name: string
  phone: string
  role: string
}

export interface DetailCLientResponse {
  id: number
  name: string
  email: string
  phone: string
  password: string
}

export interface LoginCLientRequest {

  password: string
}

export interface LoginCLientResponse {
  token: string
}
