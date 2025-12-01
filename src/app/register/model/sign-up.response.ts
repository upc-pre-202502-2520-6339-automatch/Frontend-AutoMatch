// src/app/register/model/sign-up.response.ts
export class SignUpResponse {
  constructor(
    public id: number,
    public username: string,
    public roles: string[]
  ) {}
}
