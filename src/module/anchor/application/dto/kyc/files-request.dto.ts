import { IsString } from 'class-validator';

export class FilesRequestDto {
  @IsString()
  fileId?: string;

  @IsString()
  customerId?: string;
}
