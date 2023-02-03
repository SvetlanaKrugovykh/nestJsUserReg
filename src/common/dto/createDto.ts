import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, IsPhoneNumber } from 'class-validator';

export class CreateDto {
  constructor(
    public properties: Array<{ [x: string]: any }>,
    dto: { [x: string]: any },
  ) {
    for (const prop of properties) {
      for (const key in dto) {
        if (prop.name == key) {
          Object.defineProperty(this, key, {
            value: dto[key],
            writable: true,
            configurable: true,
            enumerable: true,
          });
          this[key] = dto[key];
          if (prop.validate) this.validate.bind(this)(prop, key);
        }
      }
      this.assignApiProperty(prop);
    }
  }

  private assignApiProperty(prop) {
    if (prop.example && prop.description) {
      ApiProperty({
        example: prop.example,
        description: prop.description,
      });
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
