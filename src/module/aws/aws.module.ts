import { Global, Module } from '@nestjs/common';


import { AmazonSESService } from './application/service/ses.service';


import { AmazonS3Service } from './application/service/s3.service';



import { AmazonSNSService } from './application/service/sns.service';



import { AWSController } from './interface/aws.controller';


@Global()
@Module({
  imports: [],
  controllers: [AWSController],
  providers: [
    
    AmazonSESService,
    
    
    AmazonS3Service,
    
    
    AmazonSNSService,
    
    ],
  exports: [
    
    AmazonSESService,
    
    
    AmazonS3Service,
    
    
    AmazonSNSService,
    
    ],
})
export class AwsModule {}