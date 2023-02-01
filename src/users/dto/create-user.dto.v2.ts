import { userProperties } from '../properties/fields-user-model';
import { CreateDto } from 'src/common/dto/createDto';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
export class CreateUserDto extends CreateDto {
  email?: string;
  phoneNumber?: string;
  password?: string;
  newPassword?: string;
  verificationCode?: string;

  constructor(private readonly userDto: { [x: string]: any }) {
    super(userProperties, userDto);
  }

  @ApiModelProperty({
    example: `user@email.com !{email or phoneNumber is required (one of them); "newPassword" is optional, *!only for update-passwd}`,
  })
  @IsNotEmpty({ message: 'At least one of email or phoneNumber is required' })
  @IsOptional({ each: true })
  get oneOfEmailPhoneNumber() {
    return !!this.email || !!this.phoneNumber;
  }
}
