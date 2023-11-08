interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface AccessTokenRequest {
  grant_type: string;
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
}

interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface RefreshTokenRequest {
  grant_type: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
}
