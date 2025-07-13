// /types/user.ts
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  image?: string;
  accessToken?: string;
  githubToken?: string;
  githubUsername?: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  firstName: string;
  lastName: string;
  username: string;
}

export interface AuthThunkArgs {
  payload: LoginPayload | RegisterPayload;
  isLogin: boolean;
}
