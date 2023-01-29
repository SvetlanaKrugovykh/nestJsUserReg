import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {
    super({
      passReqToCallback: true,
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
		console.log(username, password);
    const user = await this.userService.validateUserByEmailAndPasswd(
      username,
      password,
    );
    if (!user) {
			console.log(username, password);
    
			 return username;
      //throw new UnauthorizedException();
    }
    return user;
  }
}
