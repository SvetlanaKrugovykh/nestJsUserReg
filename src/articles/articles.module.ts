import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Article } from './articles.model';

@Module({
  providers: [ArticlesService],
  controllers: [ArticlesController],
  imports: [SequelizeModule.forFeature([Article])],
})
export class ArticlesModule {}
