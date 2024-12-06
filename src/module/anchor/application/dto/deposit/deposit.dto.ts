import { IsString } from 'class-validator';

export class DepositRequestDto {
  @IsString()
  account?: string;

  @IsString()
  memoType?: string;

  @IsString()
  memo?: string;

  @IsString()
  emailAddress?: string;

  @IsString()
  type: string;

  @IsString()
  walletName?: string;

  @IsString()
  walletUrl?: string;

  @IsString()
  lang?: string;

  @IsString()
  onChangeCallback?: string;

  @IsString()
  countryCode?: string;

  @IsString()
  claimableBalanceSupported?: string;

  @IsString()
  amount: string;

  @IsString()
  assetCode: string;
}
