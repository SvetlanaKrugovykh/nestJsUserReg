import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import {
  sendVerificationEmail,
  sendVerificationSMS,
} from 'src/common/sendouter';
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async signUp(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return user;
  }

  private async findUser(userDto: CreateUserDto) {
    let user;
    if (userDto.email) {
      user = await this.userService.getUserByEmail(userDto.email);
    } else if (userDto.phoneNumber) {
      user = await this.userService.getUserByPhoneNumber(userDto.phoneNumber);
    }
    if (!user) throw new UnauthorizedException({ message: 'user not found' });
    return user;
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Uncorrect email or password',
    });
  }

  async sendVerificateCodeUser(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
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

  async passwdRecovery(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
    if (user && user.activated) {
      // Send email to user with password recovery link
    }
    return user;
  }

}
