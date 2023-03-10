import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from './product.model';

@Table({ tableName: 'prices', createdAt: false, updatedAt: false })
export class Price extends Model<Price> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Unlimit Internet 30Mbps for a month',
    description: 'The description of price',
  })
  @ForeignKey(() => Product)
  @IsNumber()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  productId: number;

  @ApiProperty({ example: '100', description: 'Price of the product' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  unit_amount: number;

  @ApiProperty({
    example: '100',
    description: 'Another price of the product for category 1',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  unit_amount_category1: number;

  @ApiProperty({ example: 'usd', description: 'currency' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;

  @ApiProperty({ example: 'month', description: 'interval' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  interval: string;

  @ApiProperty({ example: 'xxx', description: 'City code' })
  @Column({
    type: DataType.BOOLEAN,
  })
  registeredInStripe: boolean;

  @ApiProperty({ example: '01/01/2023', description: 'Price started at' })
  @Column({
    type: DataType.STRING,
  })
  startedAt: Date;

  @ApiProperty({ example: '01/01/2023', description: 'Price finished at' })
  @Column({
    type: DataType.STRING,
  })
  finishedAt: Date;

  @ApiProperty({
    example: 'price Id in Stripe',
    description: 'The price Id in Stripe',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  extPriceId: string;
}
