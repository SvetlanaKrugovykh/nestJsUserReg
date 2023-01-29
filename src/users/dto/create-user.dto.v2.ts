import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { userProperties } from '../properties/fields-model';

export class CreateUserDto {
  constructor() {
    for (const prop of userProperties) {
      if (prop.validate) {
        if (prop.IsEmail) {
          this.addIsEmail(prop);
        }
      }
      this.addApiProperty(prop);
    }
  }

  addIsEmail(prop) {
    const isEmail = IsEmail(
      { allow_display_name: false },
      { message: 'Incorrect email' },
    );
    Object.defineProperty(this, prop.name, {
      ...isEmail,
      ...prop,
    });
  }

  addApiProperty(prop) {
    const apiProperty = ApiProperty({
      example: prop.example,
      description: prop.description,
    });
    Object.defineProperty(this, prop.name, {
      ...apiProperty,
      ...prop,
    });
  }
}
