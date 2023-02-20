import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Country } from './countries.model';
import { Region } from './regions.model';

@Table({ tableName: 'city', createdAt: false, updatedAt: false })
export class City extends Model<City> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Kyiv', description: 'City name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 'xxx', description: 'City code' })
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

  @ApiProperty({ example: '22', description: 'regionId' })
  @ForeignKey(() => Region)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  regionId: number;
}
