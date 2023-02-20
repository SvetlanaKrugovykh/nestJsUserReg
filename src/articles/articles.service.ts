import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from '../common/db/models/articles.model';
import { ArticleDto } from './dto/article.dto';
import { RolesService } from 'src/roles/roles.service';
@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article) private articleRepository: typeof Article,
    private roleServices: RolesService,
  ) {}

  async createArticle(articleDto: ArticleDto) {
    const article = await this.articleRepository.create(articleDto);
    article.body = await fetch(articleDto.body).toString();
    article.save();
    return article;
  }
  async getArticle(articleDto: ArticleDto) {
    const roleName = await this.roleServices.getRoleNameByUserId(
      articleDto.userId.toString(),
    );
    const article = await this.articleRepository.findOne({
      where: { id: articleDto.articleId },
    });
    if (roleName === 'user') {
      article.body = article.body.toString();
      return article;
    } else {
      return {
        title: article.title,
        body: 'You are not allowed to see this article',
        createdAt: article.createdAt,
      };
    }
  }
}
