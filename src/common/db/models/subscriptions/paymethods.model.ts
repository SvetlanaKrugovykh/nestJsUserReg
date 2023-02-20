import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'paymethods', createdAt: false, updatedAt: false })
export class Paymethods extends Model<Paymethods> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'product Id in Stripe',
    description: 'The product Id in Stripe',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  extPaymethodsId: string;

  @ApiProperty({ example: 'unique ID', description: 'Customer id - unique ID' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  customerId: string;
}
