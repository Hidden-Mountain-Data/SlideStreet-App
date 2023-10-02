export interface AuthStatus {
  email: string;
  access_token: string; // Thinking this will always be a string, but need to ensure.
  roles: string[];
}
