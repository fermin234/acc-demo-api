import { IsString, Matches } from 'class-validator';

export class KYCRequestDto {
  @IsString()
  id?: string;

  @Matches(/^G[A-Z0-9]{55}$/)
  account?: string;

  @IsString()
  memo?: string;

  @IsString()
  memoType?: string;

  @IsString()
  type?: string;

  @IsString()
  lang?: string;
}
