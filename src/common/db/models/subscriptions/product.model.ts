import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'products', createdAt: false, updatedAt: false })
export class Product extends Model<Product> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Unlimit Internet 30Mbps',
    description: 'The name of product',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'Unlimit Internet 30Mbps for a month',
    description: 'The description of product',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @ApiProperty({
    example: 'product Id in Stripe',
    description: 'The product Id in Stripe',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  extProductId: string;

  @ApiProperty({ example: 'xxx', description: 'City code' })
  @Column({
    type: DataType.BOOLEAN,
  })
  registeredInStripe: boolean;
}
