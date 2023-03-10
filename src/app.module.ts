import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './common/db/models/users.model';
import { Role } from './common/db/models/roles.model';
import { UsersModule } from './users/users.module';
import { UserRoles } from './common/db/models/user-roles.model';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ThirdPartyServicesModule } from './third-party-services/third-party-services.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, Role, UserRoles],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    SubscriptionsModule,
    ThirdPartyServicesModule,
    ArticlesModule,
  ],
})
export class AppModule {
  constructor() {
    console.log('DB_NAME:', process.env.DB_NAME);
  }
}
