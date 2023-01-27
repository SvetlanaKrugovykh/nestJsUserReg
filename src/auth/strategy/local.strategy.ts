import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {
    super();
  }

  async validate(userDto: CreateUserDto): Promise<any> {
    const user = await this.userService.validateUser(userDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
