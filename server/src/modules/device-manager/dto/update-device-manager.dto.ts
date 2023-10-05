import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceManagerDto } from './create-device-manager.dto';

export class UpdateDeviceManagerDto extends PartialType(CreateDeviceManagerDto) {}
