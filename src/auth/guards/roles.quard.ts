import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { matching } from './matchnig.data';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private roleServices: RolesService,
    private userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const serviceName = request._parsedUrl.path;
    let roleName = 'user';
    let user: any = {};

    if (!request.body.jwttoken) {
      roleName = 'guest';
      user = await this.userService.getUserByOneProp(
        'email',
        request.body.email,
      );
    } else {
      user = await this.userService.getUserByOneProp(
        'jwttoken',
        request.body.jwttoken,
      );
      if (!user) return false;
      roleName = await this.roleServices.getRoleNameByUserId(user.id);
    }

    const service = matching.find(
      (s) =>
        serviceName.includes(s.serviceName) && roleName.includes(s.roleName),
    );

    if (service) {
      switch (service.roleName) {
        case 'guest':
          return true;
        case 'user':
          if (
            request.body.jwttoken === user.jwttoken &&
            user.tokenDateEnd > new Date()
          ) {
            return true;
          } else {
            return false;
          }
        case 'admin':
          return true;
      }
    } else {
      return false;
    }
  }
}
