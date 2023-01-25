import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ConsoleLogger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';
import {
  sendVerificationEmail,
  sendVerificationSMS,
} from 'src/common/sendouter';
@Injectable()
export class UsersService {
  [x: string]: any;
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

    if (!user.activated) {
      throw new UnauthorizedException({
        message: 'User is not activated',
      });
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (passwordEquals) {
      const { password, ...dataValuesWithoutPassword } = user.dataValues;
      user.dataValues = dataValuesWithoutPassword;
      return user;
    } else {
      throw new UnauthorizedException({
        message: 'Uncorrect email or password',
      });
    }
  }

  async createUser(userDto: CreateUserDto) {
    const existingUser = await this.findUser(userDto);
    if (existingUser) {
      throw new ConflictException({
        message: 'User already exist',
      });
    } else {
      const verificationCode = Math.floor(
        Math.random() * Math.floor(999999),
      ).toString();
      const newUser = await this.userRepository.create(userDto);
      if (verificationCode) {
        userDto.verificationCode = verificationCode;
        if (this.saveVerificateCode(userDto)) {
          this.sendVerificateCodeToUser(userDto, verificationCode);
        } else {
          throw new UnauthorizedException({
            message: 'Error saving verification code',
          });
        }
      }
      if (!newUser.activated) {
        throw new UnauthorizedException({
          message: `User ${
            newUser.email || newUser.phoneNumber
          } is not activated`,
        });
      }
      return newUser;
    }
  }

  async saveVerificateCode(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
    user.password = userDto.verificationCode;
    await user.save();
    return user;
  }

  async activateUser(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
    if (!user) {
      throw new UnauthorizedException({ message: 'User does not exist' });
    }
    console.log(userDto.verificationCode);
    console.log(user.password);
    if (userDto.verificationCode == user.password) {
      user.activated = true;
      await user.save();
      const { password, ...dataValuesWithoutPassword } = user.dataValues;
      user.dataValues = dataValuesWithoutPassword;
      return user;
    } else {
      throw new UnauthorizedException({
        message: 'Wrong verification code',
      });
    }
  }

  async setPasswd(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
    const saltRounds = 10;
    const plainPassword = userDto.password;
    const hash = await bcrypt.hash(plainPassword, saltRounds);

    user.password = hash;
    await user.save();
    const { password, ...dataValuesWithoutPassword } = user.dataValues;
    user.dataValues = dataValuesWithoutPassword;
    return user;
  }

  async updatePasswd(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    if (user) {
      const saltRounds = 10;
      const newHash = await bcrypt.hash(userDto.newPassword, saltRounds);
      user.password = newHash;
      await user.save();
      const { password, ...dataValuesWithoutPassword } = user.dataValues;
      user.dataValues = dataValuesWithoutPassword;
      return user;
    } else {
      throw new UnauthorizedException({
        message: 'Wrong previous password',
      });
    }
  }

  async sendVerificateCodeToUser(userDto: CreateUserDto, code: string) {
    const user = await this.findUser(userDto);
    if (user && !user.activated) {
      try {
        if (user.email) {
          sendVerificationEmail(user.email, code);
        } else if (user.phoneNumber) {
          sendVerificationSMS(user.phoneNumber, code);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
