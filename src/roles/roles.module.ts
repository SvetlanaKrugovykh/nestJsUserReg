import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../common/db/models/roles.model';
import { User } from '../common/db/models/users.model';
import { UserRoles } from '../common/db/models/user-roles.model';
import { DatabaseService } from 'src/common/db/database.service';

@Module({
  providers: [RolesService, DatabaseService],
  controllers: [RolesController],
  imports: [SequelizeModule.forFeature([Role, User, UserRoles])],
  exports: [RolesService],
})
export class RolesModule {}
