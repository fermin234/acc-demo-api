import { IsString, Matches } from 'class-validator';

export class BaseWithdrawDto {
  @IsString()
  type: string;

  @IsString()
  dest: string;

  @IsString()
  destExtra?: string;

  @Matches(/^G[A-Z0-9]{55}$/)
  account?: string;

  @IsString()
  memo?: string;

  @IsString()
  memoType?: string;

  @IsString()
  walletName?: string;

  @IsString()
  walletUrl?: string;

  @IsString()
  lang?: string;

  @IsString()
  onChangeCallback?: string;

  @IsString()
  amount: string;

  @IsString()
  countryCode?: string;

  @IsString()
  refundMemo?: string;

  @IsString()
  refundMemoType?: string;
}
