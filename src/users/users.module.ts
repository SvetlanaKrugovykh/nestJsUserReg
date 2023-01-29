import { Module } from '@nestjs/common';
import { UsersService } from './users.service.v1';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/users.model';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [SequelizeModule.forFeature([User])],
  exports: [UsersService],
})
export class UsersModule {}
