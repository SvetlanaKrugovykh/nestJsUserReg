import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Country } from './countries.model';

@Table({ tableName: 'region', createdAt: false, updatedAt: false })
export class Region extends Model<Region> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Kyiv', description: 'Region name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 'UA-01', description: 'Region code' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code: string;

  @ApiProperty({ example: '22', description: 'countryId' })
  @ForeignKey(() => Country)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  countryId: number;
}
