import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductDto } from './dto/product.dto';
import { Product } from './models/product.model';
import { Price } from './models/price.model';
import { Subscription } from './models/subscription.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [SubscriptionsService, ProductDto],
  controllers: [SubscriptionsController],
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Product, Price, Subscription]),
  ],
})
export class SubscriptionsModule {}
