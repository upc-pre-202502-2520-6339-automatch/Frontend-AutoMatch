// src/app/register/model/auth-response.ts
export interface AuthResponse {
  id: number;
  username: string;
  roles: string[];
  token: string;
}
