import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Role } from 'src/common/db/models/roles.model';
import { User } from 'src/common/db/models/users.model';
import { UserRoles } from 'src/common/db/models/user-roles.model';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Role) private readonly roleRepository: typeof Role,
    @InjectModel(UserRoles)
    private readonly userRolesRepository: typeof UserRoles,
  ) {}

  async executeQuery(
    query: string,
    nameOfRepository: string,
    parameters: Array<string>,
  ): Promise<any[]> {
    for (let i = 0; i < parameters.length; i++) {
      query = query.replace(`$${i + 1}`, parameters[i]);
    }
    const result = await this[nameOfRepository].sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return result;
  }
}
