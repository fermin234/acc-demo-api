import { IsNumber, IsString } from 'class-validator';

export class FeeRequestDto {
  @IsString()
  operation: string;

  @IsString()
  type?: string;

  @IsString()
  assetCode: string;

  @IsNumber()
  amount: number;
}
