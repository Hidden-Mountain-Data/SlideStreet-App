import { Injectable } from '@nestjs/common';
// import { CreateSettingDto } from './dto/create-setting.dto';
// import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  // * Commented out in order to push
  // TODO: WIP
  // create(createSettingDto: CreateSettingDto) {
  //   return 'This action adds a new setting';
  // }

  findAll() {
    return `This action returns all settings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  // * Commented out in order to push
  // TODO: WIP
  // update(id: number, updateSettingDto: UpdateSettingDto) {
  //   return `This action updates a #${id} setting`;
  // }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
