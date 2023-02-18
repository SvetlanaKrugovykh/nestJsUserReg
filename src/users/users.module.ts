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
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { RolesService } from 'src/roles/roles.service';

@Module({
  providers: [UsersService, AddressesService, RolesService],
  controllers: [UsersController],
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      UserRoles,
      Country,
      Region,
      City,
      Address,
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
