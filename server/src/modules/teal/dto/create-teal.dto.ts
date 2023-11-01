import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

class OperationResultDto {
  @IsString()
  href: string;
}

class LinksDto {
  @IsObject()
  operationResult: OperationResultDto;
}

export class CreateTealDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;

  @IsOptional()
  errorCode: string | null;

  @IsArray()
  errors: any[];

  @IsString()
  requestId: string;

  @IsObject()
  _links: LinksDto;
}
