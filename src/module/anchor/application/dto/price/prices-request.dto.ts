import { IsString } from 'class-validator';

export class PricesRequestDto {
  @IsString()
  sellAsset: string;

  @IsString()
  sellAmount?: string;

  @IsString()
  sellDeliveryMethod?: string;

  @IsString()
  buyDeliveryMethod?: string;

  @IsString()
  countryCode?: string;
}
