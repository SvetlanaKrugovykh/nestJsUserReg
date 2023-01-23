import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@email.com', description: 'Unique email' })
  @IsString({ message: 'Must be a string' })
  @IsEmail({ allow_display_name: false }, { message: 'Incorrect email' })
  readonly email: string;
  @ApiProperty({ example: 'xxxxxxxxxxxx', description: 'Unique password' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, {
    message: 'Must be at least 4 and not longer than 16 characters',
  })
  readonly password: string;
  @ApiProperty({ example: '+380XXXXXXX', description: 'Phone Number' })
  @IsPhoneNumber('UA', { message: 'Incorrect phone number' })
  readonly phoneNumber: string;
}
