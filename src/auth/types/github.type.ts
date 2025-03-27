export interface GitHubProfile {
  id: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
  displayName?: string;
}

export interface GitHubUser {
  githubId: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken?: string;
}
