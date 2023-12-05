import { PartialType } from '@nestjs/mapped-types';
import { TealSimStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateSimDto } from './create-sim.dto';

export class UpdateSimDto extends PartialType(CreateSimDto) {
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsString()
  ipAddress: string;

  @IsOptional()
  @IsEnum(TealSimStatus)
  status: TealSimStatus;

  @IsOptional()
  @IsBoolean()
  embedded: boolean;

  @IsOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsString()
  imei: string;

  @IsOptional()
  @IsString()
  imsi: string;

  @IsOptional()
  @IsString()
  iccid: string;

  @IsOptional()
  @IsString()
  msisdn: string;

  @IsOptional()
  @IsString()
  planUUID: string;

  @IsOptional()
  @IsString()
  planID: string;

  @IsOptional()
  @IsString()
  planName: string;

  @IsOptional()
  @IsString()
  planVolumeUnit: string;

  @IsOptional()
  @IsString()
  planPrice: string;

  @IsOptional()
  @IsString()
  deviceName: string;

  @IsOptional()
  @IsString()
  planChangeStatus: string;

  @IsOptional()
  // @IsString()
  clientId: number;

  @IsOptional()
  @IsString()
  clientName: string;

  @IsOptional()
  @IsString()
  clientTitle: string;

  @IsOptional()
  @IsString()
  clientUUID: string;

  @IsOptional()
  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  batchNumber: string;

  @IsOptional()
  @IsString()
  deviceGroupName: string;

  @IsOptional()
  @IsString()
  flowType: string;

  @IsOptional()
  @IsString()
  bootstrapIccid: string;

  @IsOptional()
  @IsString()
  bootstrapImsi: string;

  @IsOptional()
  // @IsString()
  cap: number;

  @IsOptional()
  // @IsString()
  usage: number;

  @IsOptional()
  // @IsString()
  capped: boolean;

  @IsOptional()
  // @IsString()
  meerkatPublicIpEnabled: boolean;

  @IsOptional()
  // @IsString()
  lastConnectedNetwork: any;

  @IsOptional()
  // @IsString()
  meerkatIpEntries: string[];

  @IsOptional()
  // @IsString()
  profileOnly: boolean;

}
