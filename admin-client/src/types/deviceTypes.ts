

interface Device {
  routerId: number;
  simId: number;
  userId: number;
  name: string;
  notes: string;
  imei: string;
  iccid: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  //Calculated data
  dataUsage: string;
  //sim data
  eid: string;
  active: boolean;
  embedded: boolean;
  provider: string;
}
