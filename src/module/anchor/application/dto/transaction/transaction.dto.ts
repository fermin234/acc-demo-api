import { IsString } from 'class-validator';

export class TransactionRequestDto {
  @IsString()
  id?: string;

  @IsString()
  stellarTransactionId?: string;

  @IsString()
  externalTransactionId?: string;

  @IsString()
  lang?: string;
}
