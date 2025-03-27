export interface User {
  id: string;
  email: string;
  name: string | null;
  isEmailVerified: boolean;
  githubId?: string | null;
  googleId?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
