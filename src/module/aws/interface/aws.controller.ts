import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';


@Controller('aws')
@ApiTags('aws')
export class AWSController {
  constructor() {}
}