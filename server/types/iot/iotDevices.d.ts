// ============ Utility Types ============

// Error-related
export interface CustomError extends Error {
  data?: any;
}

// ============ OAuth and Token Types ============

// For password grant type
export interface AccessTokenParamsPassword {
  grantType: string;
  username: string;
  password: string;
  passwordType: string;
  clientId: string;
  clientSecret: string;
}

// For refresh token grant type
export interface AccessTokenParamsRefresh {
  grantType: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

// ============ Device Configuration ============

// Device Configurations
interface DeviceConfig {
  sync: number;
  timeout: number;
  ackTimeout: number;
  ackRetries: number;
}

// Stats for devices
interface Stats {
  online: number;
  offline: number;
  total: number;
}

// ============ Device and Gateway Types ============

// Gateway client details
export interface GatewayClient {
  iface: string;
  mac: string;
  ipAddress: string;
  hostname: string;
  ttl: number;
}

// Basic device model
export interface Device {
  oid: string;
  name: string;
  serialNumber: string;
  model: string;
  modelId: string;
  online: number;
  protocol: string;
  config: DeviceConfig;
  pubIp: string;
  pubPort: number;
  syncState: number;
  vendorId: number;
  _id: string;
}

// Response from a Devices API call
export interface DevicesResponse {
  result: Device[];
  total: number;
  cursor: number;
  limit: number;
  stats: Stats;
}

// Gateway clients result type
interface GatewayClientsResult {
  oid: string;
  count: number;
  clients: GatewayClient[];
  updatedAt: string;
  _id: string;
}

// Response from a Gateway Clients API call
export interface GatewayClientsResponse {
  result: GatewayClientsResult;
}
