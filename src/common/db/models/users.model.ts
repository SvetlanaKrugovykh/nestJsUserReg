import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from './roles.model';
import { UserRoles } from './user-roles.model';

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
    example: 'xxxxxxxx@xxx.com',
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
    example: 'xxxxxxxxxxxx',
    description: 'Unique password, length for 4 to 16',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @ApiProperty({ example: 'true', description: 'Activated user or not' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  activated: boolean;

  @ApiProperty({ example: 'XXXXXX', description: 'Verification code' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verificationCode: string;

  @ApiProperty({ example: '01/02/2023 15:15:22', description: 'Created at' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  createdAt: Date;

  @ApiProperty({ example: '01/02/2023 15:15:22', description: 'Updated at' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt: Date;

  @ApiProperty({ example: 'unique ID', description: 'Customer id - unique ID' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  customerId: string;

	@ApiProperty({ example: 'dsfsdfsdfds333e', description: 'jwttoken' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  jwttoken: string;

	@ApiProperty({ example: '01/02/2023 15:15:22', description: 'Token Ended at' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  tokenDateEnd: Date;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}

//`␍` should be stayed but prittier does not rematk it
