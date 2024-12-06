import { IsString } from 'class-validator';

import { PricesRequestDto } from './prices-request.dto';

export class PriceRequestDto extends PricesRequestDto {
  @IsString()
  buyAsset: string;

  @IsString()
  buyAmount?: string;

  @IsString()
  context: string;
}
