import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AnchorService } from './application/service/anchor.service';
import SEP1Adapter from './infrastructure/seps/SEP1';
import SEP6Adapter from './infrastructure/seps/sep6.adapter';
import SEP10Adapter from './infrastructure/seps/sep10.adapter';
import SEP12Adapter from './infrastructure/seps/sep12.adapter';
import SEP24Adapter from './infrastructure/seps/sep24.adapter';
import SEP38Adapter from './infrastructure/seps/sep38.adapter';
import { AnchorController } from './interface/anchor.controller';

@Module({
  imports: [HttpModule],
  controllers: [AnchorController],
  providers: [
    AnchorService,
    SEP1Adapter,
    SEP10Adapter,
    SEP6Adapter,
    SEP12Adapter,
    SEP24Adapter,
    SEP38Adapter,
  ],
})
export class AnchorModule {}
