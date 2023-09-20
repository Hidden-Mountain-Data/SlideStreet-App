import { Controller, Delete, Get, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // * Commented out in order to push
  // TODO: WIP
  // @Post()
  // create(@Body() createSettingDto: CreateSettingDto) {
  //   return this.settingsService.create(createSettingDto);
  // }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(+id);
  }

  // * Commented out in order to push
  // TODO: WIP
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
  //   return this.settingsService.update(+id, updateSettingDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingsService.remove(+id);
  }
}
