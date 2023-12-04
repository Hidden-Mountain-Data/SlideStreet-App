import { Model } from "@prisma/client";
export class RouterDto {
  routerId: number;
  simId: number;
  userId: number;
  name: string;
  model: Model;
  notes: string;
  imei: string;
  iccid: string;
  serialNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  //Calculated data
  dataUsage: string;
  //sim data
  eid: string;
  active: boolean;
  embedded: boolean;
  provider: string;

}