import { forwardRef, Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Article } from './articles.model';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.model';
import { DatabaseService } from 'src/common/db/database.service';

@Module({
  providers: [ArticlesService, RolesService, DatabaseService],
  controllers: [ArticlesController],
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Article, Role, User, UserRoles]),
  ],
})
export class ArticlesModule {}
