import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  IsString,
  IsEmail,
  Length,
  IsPhoneNumber,
  IsOptional,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class UserDto {
  @ApiModelProperty({
    example: `user@email.com !{email or phoneNumber is required (one of them); "newPassword": "xxxxxxxxxxxx" is optional, !only for update-passwd}`,
  })
  @ApiProperty({
    example: 'user@email.com',
    description: 'Unique email (optional if the phone number filled)',
  })
  @IsOptional()
  @ValidateIf((o) => !o.phoneNumber)
  @IsEmail({ allow_display_name: false }, { message: 'Incorrect email' })
  readonly email: string;

  @ApiProperty({
    example: '+380XXXXXXX',
    description: 'Phone Number (optional if email filled)',
  })
  @IsOptional()
  @ValidateIf((o) => !o.email)
  @IsPhoneNumber('UA', { message: 'Incorrect phone number' })
  readonly phoneNumber: string;

  @IsOptional()
  @ApiProperty({
    example: 'xxxxxxxxxxxx',
    description: '[Optional, used only when password changed] Unique password',
  })
  @IsString({ message: 'password must be a string' })
  @Length(4, 16, {
    message: 'password must be at least 4 and not longer than 16 characters',
  })
  readonly password: string;

  @IsOptional()
  @ApiProperty({
    example: 'xxxxxxxxxxxx',
    description: '[Optional, used only when password changed] Unique password',
  })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, {
    message: 'Must be at least 4 and not longer than 16 characters',
  })
  readonly newPassword: string;

  @IsOptional()
  @ApiProperty({
    description: '[Optional, used only user is creating] ',
  })
  verificationCode: string;

  @ApiProperty({ example: '1', description: 'roleId' })
  @IsOptional()
  readonly roleId: number;

  //#region  contact info
  @ApiProperty({ example: 'Ukraine', description: 'country' })
  @IsOptional()
  readonly country: string;

  @ApiProperty({ example: 'PA', description: 'region' })
  @IsOptional()
  readonly region: string;

  @ApiProperty({ example: 'Kyiv', description: 'city' })
  @IsOptional()
  readonly city: string;

  @ApiProperty({ example: 'Market street', description: 'street' })
  @IsOptional()
  @IsString({ message: 'street must be filled' })
  @Length(3, 55, {
    message: 'address must be at least 3 and not longer than 55 characters',
  })
  readonly street: string;
  @ApiProperty({ example: '22', description: 'building' })
  @IsOptional()
  readonly house: string;
  @ApiProperty({ example: '#171', description: 'apartment' })
  @IsOptional()
  readonly apartment: string;
  //#endregion
  @ApiProperty({ example: '5', description: 'userId' })
  @IsOptional()
  readonly userId: number;

  readonly jwttoken: string;
  readonly tokenDateEnd: Date;

  static roleId: any;

  @IsNotEmpty({ message: 'At least one of email or phoneNumber is required' })
  @IsOptional({ each: true })
  get oneOfEmailPhoneNumber() {
    return !!this.email || !!this.phoneNumber;
  }
}
