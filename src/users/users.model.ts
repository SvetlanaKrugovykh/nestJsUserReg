import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttrs {
  email: string;
  password: string;
  phoneNumber: string;
}
@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ApiProperty({
    example: '+380671111111',
    description: 'Unique phone number (optional if email filled)',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
    validate: {
      isEmailOrPhoneNumber() {
        if (!this.email && !this.phoneNumber) {
          throw new Error('You must provide either an email or a phone number');
        }
      },
    },
  })
  phoneNumber: string;
  @ApiProperty({
    example: '2323@sdfs.com2',
    description: 'Unique email, (optional if the phone number filled)',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
    validate: {
      isEmailOrPhoneNumber() {
        if (!this.email && !this.phoneNumber) {
          throw new Error('You must provide either an email or a phone number');
        }
      },
    },
  })
  email: string;

  @ApiProperty({ example: 'xxxxxxxxxxxx', description: 'Unique password' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @ApiProperty({ example: 'true', description: 'Activated user or not' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  activated: boolean;

}
