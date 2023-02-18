import { Controller } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  // @Post()
  // create(@Body() dto: CreateRoleDto) {
  //   return this.roleService.createRole(dto);
  // }
}
