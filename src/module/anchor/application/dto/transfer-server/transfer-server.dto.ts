import { IsString } from 'class-validator';

export class TransferServerRequestDto {
  @IsString()
  lang?: string;
}
