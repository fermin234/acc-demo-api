import { IsString, Matches } from 'class-validator';

export class DepositExchangeDto {
  @Matches(/^G[A-Z0-9]{55}$/)
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
  destinationAsset: string;

  @IsString()
  sourceAsset: string;

  @IsString()
  quoteId?: string;
}
