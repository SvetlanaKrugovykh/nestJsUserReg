import { Module } from '@nestjs/common';
import { ThirdPartyService } from './third-party-services.service';
import { ThirdPartyServicesController } from './third-party-services.controller';

@Module({
  providers: [ThirdPartyService],
  controllers: [ThirdPartyServicesController]
})
export class ThirdPartyServicesModule {}

