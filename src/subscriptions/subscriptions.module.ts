import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductDto } from './dto/product.dto';
import { Product } from './models/product.model';
import { Price } from './models/price.model';
import { Subscription } from './models/subscription.model';
import { UsersModule } from 'src/users/users.module';
import { Paymethods } from './models/paymethods.model';
import { CalendarService } from 'src/common/google.api/reminder';
import { MapsService } from 'src/common/google.api/maps';

@Module({
  providers: [SubscriptionsService, CalendarService, MapsService, ProductDto],
  controllers: [SubscriptionsController],
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Product, Price, Subscription, Paymethods]),
  ],
})
export class SubscriptionsModule {}
