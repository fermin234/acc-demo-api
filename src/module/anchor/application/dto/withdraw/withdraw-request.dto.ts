import { IsString } from 'class-validator';

import { BaseWithdrawDto } from './base-withdraw.dto';

export class WithdrawRequestDto extends BaseWithdrawDto {
  @IsString()
  assetCode: string;
}
