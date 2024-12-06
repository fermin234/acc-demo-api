import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class VerificationKeys {
  [key: string]: string;
}

export class KYCVerificationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested()
  @Type(() => VerificationKeys)
  verificationKeys: VerificationKeys;
}
