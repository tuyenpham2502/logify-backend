import type { Profile } from 'passport-google-oauth20';

export interface GoogleProfile extends Profile {
  id: string;
  displayName: string;
  emails?: Array<{ value: string; verified: boolean }>;
  photos?: Array<{ value: string }>;
}

export interface GoogleUser {
  googleId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken?: string;
}
