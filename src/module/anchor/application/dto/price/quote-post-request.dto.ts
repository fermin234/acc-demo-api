import { IsString } from 'class-validator';

import { PricesRequestDto } from './prices-request.dto';

export class QuotePostRequestDto extends PricesRequestDto {
  @IsString()
  buyAsset: string;

  @IsString()
  buyAmount?: string;

  @IsString()
  expireAfter?: string;

  @IsString()
  context: string;
}
