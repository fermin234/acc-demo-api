import { Matches } from 'class-validator';

export class GetChallengeDto {
  @Matches(/^G[A-Z0-9]{55}$/)
  publicKey: string;
}
