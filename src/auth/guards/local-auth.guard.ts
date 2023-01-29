import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

//export class LocalAuthGuard implements CanActivate {
  //constructor(private authService: AuthService) {}

  //async canActivate(context: ExecutionContext): Promise<boolean> {
  //  const request = context.switchToHttp().getRequest();
  //  const user = await this.authService.validateUser(request.body);
  //  if (!user) {
  //    throw new UnauthorizedException();
  //  }
  //  return true;
 // }
//}