import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { User } from '../../users/users.model';

@Table({ tableName: 'subscriptions', createdAt: false, updatedAt: false })
export class Subscription extends Model<Subscription> {
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
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  productId: number;

  @ApiProperty({
    example: 'Unlimit Internet 30Mbps for a month',
    description: 'The description of price',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: number;

  @ApiProperty({ example: '100', description: 'Price of the product' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  unit_amount: number;

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
    type: DataType.STRING,
  })
  Activated: boolean;

  @ApiProperty({ example: 'xxx', description: 'City code' })
  @Column({
    type: DataType.STRING,
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
}
