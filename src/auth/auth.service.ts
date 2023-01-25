import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async activate(userDto: CreateUserDto) {
    const user = await this.userService.activateUser(userDto);
    return user;
  }

  async signIn(userDto: CreateUserDto) {
    const user = await this.userService.validateUser(userDto);
    return user;
  }

  async signUp(userDto: CreateUserDto) {
    const user = await this.userService.createUser(userDto);
    return user;
  }

  async setPasswd(userDto: CreateUserDto) {
    const user = await this.userService.setPasswd(userDto);
    return user;
  }

  async updatePasswd(userDto: CreateUserDto) {
    const user = await this.userService.updatePasswd(userDto);
    return user;
  }
}
