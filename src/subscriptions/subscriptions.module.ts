import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductDto } from './dto/product.dto';
import { Product } from './models/product.model';
import { Price } from './models/price.model';
import { Subscription } from './models/subscription.model';

@Module({
  providers: [SubscriptionsService, ProductDto],
  controllers: [SubscriptionsController],
  imports: [SequelizeModule.forFeature([Product, Price, Subscription])],
})
export class SubscriptionsModule {}
