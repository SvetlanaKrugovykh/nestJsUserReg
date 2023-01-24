import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

import {
  sendVerificationEmail,
  sendVerificationSMS,
} from 'src/common/sendouter';
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signIn(userDto: CreateUserDto) {
    const user = await this.userService.validateUser(userDto);
    return user;
  }

  async signUp(userDto: CreateUserDto) {
    const user = await this.userService.createUser(userDto);
    return user;
  }

  async resetPasswd(userDto: CreateUserDto) {
    const user = await this.userService.resetPasswd(userDto);
    return user;
  }

  async updatePasswd(userDto: CreateUserDto) {
    const user = await this.userService.updatePasswd(userDto);
    return user;
  }
  async sendVerificateCodeToUser(userDto: CreateUserDto) {
    const user = await this.userService.findUser(userDto);
    if (user && !user.activated) {
      const code = Math.floor(Math.random() * Math.floor(999999)).toString();
      if (user.email) {
        sendVerificationEmail(user.email, code);
      } else if (user.phoneNumber) {
        sendVerificationSMS(user.phoneNumber, code);
      }
    }
    return user;
  }
}
