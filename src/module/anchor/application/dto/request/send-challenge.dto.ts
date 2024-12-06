import { IsString } from 'class-validator';

export class SendChallengeDto {
  @IsString()
  signedXdr: string;
}
