import { Injectable } from '@nestjs/common';
import { CreateDeviceManagerDto } from './dto/create-device-manager.dto';
import { UpdateDeviceManagerDto } from './dto/update-device-manager.dto';

@Injectable()
export class DeviceManagerService {
  create(createDeviceManagerDto: CreateDeviceManagerDto) {
    return 'This action adds a new deviceManager';
  }

  findAll() {
    return `This action returns all deviceManager`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deviceManager`;
  }

  update(id: number, updateDeviceManagerDto: UpdateDeviceManagerDto) {
    return `This action updates a #${id} deviceManager`;
  }

  remove(id: number) {
    return `This action removes a #${id} deviceManager`;
  }
}
