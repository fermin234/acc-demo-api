import { IsString, Matches } from 'class-validator';

export class TransactionsRequestDto {
  @IsString()
  assetCode: string;

  @Matches(/^G[A-Z0-9]{55}$/)
  account?: string;

  @IsString()
  noOlderThan?: string;

  limit?: number;

  @IsString()
  pagingId?: string;

  @IsString()
  lang?: string;

  @IsString()
  kind?: string;
}
