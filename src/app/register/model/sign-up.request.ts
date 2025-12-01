// src/app/register/model/sign-up.request.ts
export class SignUpRequest {
  constructor(
    public username: string,
    public password: string,
    public roles: string[]
  ) {}
}
