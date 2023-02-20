import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface ArticleCreationAttrs {
  title: string;
  body: string;
}

@Table({ tableName: 'articles' })
export class Article extends Model<Article, ArticleCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'WAR IN UKRAINE',
    description: 'The title of the article',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @ApiProperty({
    example: 'It`s continued and continued and continued...',
    description: 'The content of the article',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  body: string;

  @ApiProperty({ example: '01/02/2023 15:15:22', description: 'Created at' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  createdAt: Date;
}
