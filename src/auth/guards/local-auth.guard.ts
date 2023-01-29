import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {
    super();
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;
    if (err || !user) {
      if (!email) {
        throw new HttpException(
          { message: 'email is not filled in' },
          HttpStatus.OK,
        );
      } else if (!password) {
        throw new HttpException(
          { message: 'Password is not filled in' },
          HttpStatus.OK,
        );
      } else {
        const rez = this.login(request.body);
        if (rez) {
          return rez;
        } else {
          throw err || new UnauthorizedException();
        }
      }
    }
    return user;
  }

  async login(user: any): Promise<any> {
    const rez = await this.userService.validateUserByEmailAndPasswd(
      user.email,
      user.password,
    );
    if (rez) {
      const payload = { username: user.email, sub: rez.dataValues.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      return rez;
    }
  }
}
