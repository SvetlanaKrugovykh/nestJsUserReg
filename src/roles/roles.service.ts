import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { UserRoles } from './user-roles.model';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/users.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(UserRoles) private UserRolesRepository: typeof UserRoles,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }

  async addRole(userDto: UserDto, user: User) {
    try {
      const role = await this.UserRolesRepository.create({
        roleId: UserDto.roleId,
        userId: user.id,
      });
      return role;
    } catch (e) {
      throw new UnauthorizedException({
        message: e.message,
      });
    }
  }
}
