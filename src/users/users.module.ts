import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Country } from './contacts/countries.model';
import { Region } from './contacts/regions.model';
import { City } from './contacts/cities.model';
import { Address } from './contacts/addresses.model';
import { AddressesService } from './contacts/addresses.services';

@Module({
  providers: [UsersService, AddressesService],
  controllers: [UsersController],
  imports: [SequelizeModule.forFeature([User, Country, Region, City, Address])],
  exports: [UsersService],
})
export class UsersModule {}
