import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { RolesGuard } from 'src/auth/guards/roles.quard';
import { Body, Post, UseGuards } from '@nestjs/common';
import { ArticleDto } from './dto/article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Get the article' })
  @ApiResponse({ status: 200, type: ArticleDto })
  @Post('/create-article')
  @UseGuards(RolesGuard)
  createArticle(@Body() articleDto: ArticleDto) {
    return this.articlesService.createArticle(articleDto);
  }

  @ApiOperation({ summary: 'Get the article' })
  @ApiResponse({ status: 200, type: ArticleDto })
  @Post('/get-article')
  @UseGuards(RolesGuard)
  getArticle(@Body() articleDto: ArticleDto) {
    return this.articlesService.getArticle(articleDto);
  }
}
