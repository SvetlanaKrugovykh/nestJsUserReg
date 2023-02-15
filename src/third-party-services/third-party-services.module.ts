import { Module } from '@nestjs/common';
import { ThirdPartyService } from './third-party-services.service';
import { ThirdPartyServicesController } from './third-party-services.controller';
import { ConvertService } from '../common/converters/converter';

@Module({
  providers: [ThirdPartyService, ConvertService],
  controllers: [ThirdPartyServicesController],
})
export class ThirdPartyServicesModule {}
