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
    let userId = null;

    if (request.body.userId) {
      userId = request.body.userId;
    } else if (request.body.email) {
      const user: any = await this.userService.getUserByOneProp(
        'email',
        request.body.email,
      );
      userId = user.id;
    }
    const serviceName = request._parsedUrl.path;

    if (!(userId || serviceName)) return false;

    const roleName = await this.roleServices.getRoleNameByUserId(userId);
    const service = matching.find(
      (s) =>
        serviceName.includes(s.serviceName) && roleName.includes(s.roleName),
    );
    if (service) {
      return true;
    } else {
      return false;
    }
  }
}
