import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const saltRounds = 10;
    const plainPassword = dto.password;

    const hash = await bcrypt.hash(plainPassword, saltRounds);

    const newDto = {
      ...dto,
      password: hash,
    };

    const user = await this.userRepository.create(newDto);
    return user;
  }

  async activateUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      include: { all: true },
    });
    user.activated = true;
    await user.save();
    return user;
  }

  async savePasswd(id: number, passwd: string) {
    const hash = await bcrypt.hash(passwd, 10);
    const user = await this.userRepository.findOne({
      where: { id },
      include: { all: true },
    });
    user.password = hash;
    await user.save();
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async getUserByPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
      include: { all: true },
    });
    return user;
  }
}
