import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { ProductDto } from './dto/product.dto';

@Module({
  providers: [SubscriptionsService, ProductDto],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
