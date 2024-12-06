import { IsString } from 'class-validator';

import { BaseWithdrawDto } from './base-withdraw.dto';

export class WithdrawExchangeDto extends BaseWithdrawDto {
  @IsString()
  sourceAsset: string;

  @IsString()
  destinationAsset: string;

  @IsString()
  quoteId?: string;
}
