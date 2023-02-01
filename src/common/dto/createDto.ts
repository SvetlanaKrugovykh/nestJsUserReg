import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Length,
  IsPhoneNumber,
} from 'class-validator';

export class CreateDto {
  constructor(
    public properties: Array<{ [x: string]: any }>,
    dto: { [x: string]: any },
  ) {
    for (const prop of properties) {
      this.apiProp(prop);
      for (const key in dto) {
        if (prop.name == key) {
          Object.defineProperty(this, key, {
            value: undefined,
            writable: true,
            configurable: true,
            enumerable: true,
          });
          this[key] = dto[key];
          if (prop.validate) this.validate.bind(this)(prop, key);
        }
      }
    }
  }

  private apiProp(prop) {
    if (!prop.exclude_dto) {
      if (prop.example && prop.description) {
        ApiProperty({
          example: prop.example,
          description: prop.description,
        })(this, prop);
      }
    }
  }

  private validate(prop, key) {
    if (prop.IsString_) {
      IsString()(this, key);
    }
    if (prop.Length) {
      Length(prop.Length.min, prop.Length.max)(this, key);
    }
    if (prop.IsEmail) {
      IsEmail()(this, key);
    }
    if (prop.IsPhoneNumber) {
      IsPhoneNumber('UA')(this, key);
    }
  }
}
