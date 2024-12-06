import { IsString, Matches } from 'class-validator';
import { GetChallengeDto } from './get-challenge.dto';

export class SignChallengeDto extends GetChallengeDto {
  @Matches(/^S[A-Z0-9]{55}$/)
  secretKey: string;

  @IsString()
  challengeXdr: string;
}
