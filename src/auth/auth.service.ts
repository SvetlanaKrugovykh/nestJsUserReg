import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from '../users/users.service';

//import { User } from 'src/users/users.model.v2';
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async activate(userDto: UserDto) {
    const user = await this.userService.activateUser(userDto);
    return user;
  }

  async signIn(userDto: UserDto) {
    const user = await this.userService.validateUser(userDto);
    return user;
  }

  async signUp(userDto: UserDto) {
    const user = await this.userService.createUser(userDto);
    return user;
  }

  async setPasswd(userDto: UserDto) {
    const user = await this.userService.setPasswd(userDto);
    return user;
  }

  async updatePasswd(userDto: UserDto) {
    const user = await this.userService.updatePasswd(userDto);
    return user;
  }

  async resetPasswd(userDto: UserDto) {
    const user = await this.userService.resetPasswd(userDto);
    return user;
  }
}
