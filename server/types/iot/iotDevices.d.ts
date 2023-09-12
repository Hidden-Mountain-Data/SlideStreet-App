export interface DeviceConfig {
  sync: number;
  timeout: number;
  ackTimeout: number;
  ackRetries: number;
}

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

export interface Stats {
  online: number;
  offline: number;
  total: number;
}

export interface DevicesResponse {
  result: Device[];
  total: number;
  cursor: number;
  limit: number;
  stats: Stats;
}
