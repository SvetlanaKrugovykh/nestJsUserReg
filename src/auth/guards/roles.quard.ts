import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log(request.body.email);
    //here check the request and the user role and return true or false
    const user = request.user; // assuming user object is added to the request object by Passport

    if (user === 'admin') {
      return true;
    } else if (user === 'user') {
      return true;
    } else {
      return false;
    }
  }
}
