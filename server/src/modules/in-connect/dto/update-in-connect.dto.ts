import { PartialType } from '@nestjs/mapped-types';
import { CreateInConnectDto } from './create-in-connect.dto';

export class UpdateInConnectDto extends PartialType(CreateInConnectDto) {}
