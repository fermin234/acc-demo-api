import {
  Controller,
  Get,
  
  Body
  
  } from '@nestjs/common';

import { GetChallengeDto } from '../application/dto/request/get-challenge.dto';
import { SendChallengeDto } from '../application/dto/request/send-challenge.dto';
import { SignChallengeDto } from '../application/dto/request/sign-challenge.dto';

import { AnchorService } from '../application/service/anchor.service';

@Controller('anchor')
export class AnchorController {
  constructor(private anchorService: AnchorService) {}

  @Get('')
  async getAnchorTomlInfo() {
    return await this.anchorService.getToml();
  }
  
  @Get('challenge')
  async getChallenge(@Body() { publicKey }: GetChallengeDto) {
    return await this.anchorService.getChallenge(publicKey);
  }

  @Get('sign-challenge')
  async signChallenge(
    @Body()
    { publicKey, secretKey, challengeXdr }: SignChallengeDto,
  ) {
    return await this.anchorService.signChallenge(publicKey, secretKey, challengeXdr);
  }

  @Get('send-challenge')
  async sendChallenge(@Body() { signedXdr }: SendChallengeDto) {
    return await this.anchorService.sendChallenge(signedXdr);
  }


  @Get('sep6')
  async getSep6Info() {
    return await this.anchorService.getSep6Info();
  }

}
