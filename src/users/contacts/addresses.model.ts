import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users.model';
import { Country } from './countries.model';
import { Region } from './regions.model';
import { City } from './cities.model';

@Table({ tableName: 'address', createdAt: false, updatedAt: false })
export class Address extends Model<Address> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Market', description: 'Street name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  street: string;

  @ApiProperty({ example: 'xxx', description: 'House number' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  house: string;

  @ApiProperty({ example: 'xxx', description: 'Apartment number' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  apartment: string;

  @ApiProperty({ example: '22', description: 'cityId' })
  @ForeignKey(() => City)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cityId: number;

  @ApiProperty({ example: '22', description: 'regionId' })
  @ForeignKey(() => Region)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  regionId: number;

  @ApiProperty({ example: '22', description: 'countryId' })
  @ForeignKey(() => Country)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  countryId: number;

  @ApiProperty({ example: '019035', description: 'zipCode' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  zipCode: string;

  @ApiProperty({ example: '55.36464646', description: 'latitude' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  latitude: string;

  @ApiProperty({ example: '30.54545545', description: 'longitude' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  longitude: string;

  @ApiProperty({ example: 'sss@fgsdfg.com', description: 'User' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false,
  })
  userId: number;
}
