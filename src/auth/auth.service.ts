import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return user;
  }

  private async validateUser(userDto: CreateUserDto) {
    let user;
    if (userDto.email) {
      user = await this.userService.getUserByEmail(userDto.email);
    } else if (userDto.phoneNumber) {
      user = await this.userService.getUserByPhoneNumber(userDto.phoneNumber);
    }
    if (!user) throw new UnauthorizedException({ message: 'user not found' });

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
}
