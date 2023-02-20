import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../common/db/models/users.model';
import { Country } from '../common/db/models/contacts/countries.model';
import { Region } from '../common/db/models/contacts/regions.model';
import { City } from '../common/db/models/contacts/cities.model';
import { Address } from '../common/db/models/contacts/addresses.model';
import { AddressesService } from './contacts/addresses.services';
import { Role } from 'src/common/db/models/roles.model';
import { UserRoles } from '../common/db/models/user-roles.model';
import { RolesService } from 'src/roles/roles.service';
import { DatabaseService } from 'src/common/db/database.service';

@Module({
  providers: [UsersService, AddressesService, RolesService, DatabaseService],
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
