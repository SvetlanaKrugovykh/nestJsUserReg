import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../common/db/models/roles.model';
import { UserRoles } from '../common/db/models/user-roles.model';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from '../common/db/models/users.model';
import { DatabaseService } from '../common/db/database.service';
import { getRolesByUseId } from '../common/db/requests';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
    private databaseService: DatabaseService,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }

  async getRoleNameByUserId(id: number) {
    const data: any = await this.databaseService.executeQuery(
      getRolesByUseId,
      'userRolesRepository',
      [id.toString()],
    );
    return data[0].role_value;
  }

  async addRole(userDto: UserDto, user: User) {
    try {
      const role = await this.userRolesRepository.create({
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
