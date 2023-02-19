import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseService } from './database.service';
import { User } from '../../users/users.model';
import { Role } from '../../roles/roles.model';
import { UserRoles } from '../../roles/user-roles.model';

@Module({
  providers: [DatabaseService],
  imports: [SequelizeModule.forFeature([User, Role, UserRoles])],
  exports: [DatabaseService],
})
export class DatabaseModule {
  constructor(
    private readonly userRepository: typeof User,
    private readonly roleRepository: typeof Role,
    private readonly userRolesRepository: typeof UserRoles,
  ) {}
}
