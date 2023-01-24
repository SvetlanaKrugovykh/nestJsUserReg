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

export class CreateUserDto {
  @ApiModelProperty({
    example: `user@email.com !{email or phoneNumber is required (one of them); "newPassword": "xxxxxxxxxxxx" is optional, !only for update-passwd}`
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

  @ApiProperty({ example: 'xxxxxxxxxxxx', description: 'Unique password' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, {
    message: 'Must be at least 4 and not longer than 16 characters',
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

  @IsNotEmpty({ message: 'At least one of email or phoneNumber is required' })
  @IsOptional({ each: true })
  get oneOfEmailPhoneNumber() {
    return !!this.email || !!this.phoneNumber;
  }
}
