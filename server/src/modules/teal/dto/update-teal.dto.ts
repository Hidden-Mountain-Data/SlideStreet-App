import { PartialType } from '@nestjs/mapped-types';
import { CreateTealDto } from './create-teal.dto';

export class UpdateTealDto extends PartialType(CreateTealDto) {}
