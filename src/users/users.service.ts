import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async findUser(userDto: CreateUserDto) {
    let user;
    if (userDto.email) {
      user = await this.getUserByEmail(userDto.email);
    } else if (userDto.phoneNumber) {
      user = await this.getUserByPhoneNumber(userDto.phoneNumber);
    }
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

  async validateUser(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
    if (!user) {
      throw new UnauthorizedException({ message: 'User does not exist' });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Uncorrect email or password',
    });
  }

  async createUser(userDto: CreateUserDto) {
    const existingUser = await this.findUser(userDto);
    if (existingUser) {
      return existingUser;
    } else {
      //create new user
      const saltRounds = 10;
      const plainPassword = userDto.password;

      const hash = await bcrypt.hash(plainPassword, saltRounds);

      const newDto = {
        ...userDto,
        password: hash,
      };

      const newUser = await this.userRepository.create(newDto);
      return newUser;
    }
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

  async resetPasswd(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
    const saltRounds = 10;
    const plainPassword = userDto.password;
    const hash = await bcrypt.hash(plainPassword, saltRounds);

    user.password = hash;
    await user.save();
    return user;
  }

  async updatePasswd(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    if (user) {
      const saltRounds = 10;
      const newHash = await bcrypt.hash(userDto.newPassword, saltRounds);
      user.password = newHash;
      await user.save();
      return user;
    } else {
      throw new UnauthorizedException({
        message: 'Wrong previus password',
      });
    }
  }
}
