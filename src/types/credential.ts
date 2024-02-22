export type TCredential = {
  email: string;
  backendURL: string;
  accessToken: string;
  accessTokenExpiresIn?: string;
  refreshToken?: string;
  oauthClientId?: string;
  oauthClientSecret?: string;
}
