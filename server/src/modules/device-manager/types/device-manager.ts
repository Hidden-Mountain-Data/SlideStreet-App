export interface DeviceGatewayClientsResponse {
  version: string;
  id: string;
  code: number;
  message: string;
  data: {
    result: {
      oid: string;
      count: number;
      clients: any[];
      updated_at: string;
      _id: string;
    };
  };
}

interface Device {
  oid: string;
  name: string;
  serial_number: string;
  model: string;
  model_id: string;
  online: number;
  protocol: string;
  config: {
    sync: number;
    timeout: number;
    ack_timeout: number;
    ack_retries: number;
  };
  pub_ip: string;
  pub_port: number;
  sync_state: number;
  address: string;
  vendor_id: number;
  _id: string;
}

interface DeviceStats {
  online: number;
  offline: number;
  total: number;
}

export interface DevicesResponse {
  version: string;
  id: string;
  code: number;
  message: string;
  data: {
    result: Device[];
    total: number;
    cursor: number;
    limit: number;
    stats: DeviceStats;
  };
}
