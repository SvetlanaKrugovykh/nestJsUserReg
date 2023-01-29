import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto.v1';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  async resetPasswd(userDto: CreateUserDto) {
    const user = await this.userService.resetPasswd(userDto);
    return user;
  }
}
