import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductDto } from './dto/product.dto';
import { Product } from '../common/db/models/subscriptions/product.model';
import { Price } from '../common/db/models/subscriptions/price.model';
import { Subscription } from '../common/db/models/subscriptions/subscription.model';
import { UsersModule } from 'src/users/users.module';
import { Paymethods } from '../common/db/models/subscriptions/paymethods.model';
import { CalendarService } from 'src/common/google.api/reminder';
import { MapsService } from 'src/common/google.api/maps';
import { RolesService } from 'src/roles/roles.service';
import { User } from '../common/db/models/users.model';
import { Role } from 'src/common/db/models/roles.model';
import { UserRoles } from '../common/db/models/user-roles.model';
import { DatabaseService } from 'src/common/db/database.service';

@Module({
  providers: [
    SubscriptionsService,
    CalendarService,
    MapsService,
    ProductDto,
    RolesService,
    DatabaseService,
  ],
  controllers: [SubscriptionsController],
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([
      Product,
      Price,
      User,
      Subscription,
      Paymethods,
      Role,
      UserRoles,
    ]),
  ],
})
export class SubscriptionsModule {}
