import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto.v2';
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

  async validateUserByEmailAndPasswd(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    if (!user) {
      throw new UnauthorizedException({ message: 'User does not exist' });
    } else {
      const passwordEquals = await bcrypt.compare(password, user.password);
      if (passwordEquals) {
        return user;
      } else {
        throw new UnauthorizedException({
          message: 'Incorrect email or password',
        });
      }
    }
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
      return {
        ...user.dataValues,
        password: undefined,
        verificationCode: undefined,
      };
    } else {
      throw new UnauthorizedException({
        message: 'Incorrect email or password',
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
    user.verificationCode = userDto.verificationCode;
    user.createdAt = new Date();
    await user.save();
    return user;
  }

  async activateUser(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
    if (!user) {
      throw new UnauthorizedException({ message: 'User does not exist' });
    }
    if (user.activated) {
      throw new UnauthorizedException({
        message: 'The user was activated earlier',
      });
    }

    if (
      new Date().getTime() - user.createdAt >
      Number(process.env.VERIFICATION_CODE_TIME)
    ) {
      throw new UnauthorizedException({
        message: 'Exceeds the time limit for verification',
      });
    }
    if (userDto.verificationCode == user.verificationCode) {
      user.activated = true;
      user.updatedAt = new Date();
      await user.save();
      return {
        ...user.dataValues,
        password: undefined,
        verificationCode: undefined,
      };
    } else {
      throw new UnauthorizedException({
        message: 'Wrong verification code',
      });
    }
  }

  async setPasswd(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
    if (!user) {
      throw new UnauthorizedException({ message: 'User does not exist' });
    }
    if (user.activated) {
      throw new UnauthorizedException({
        message:
          'Method set-passwd is intended for users, who not activated yet',
      });
    }
    const saltRounds = 10;
    const plainPassword = userDto.password;
    const hash = await bcrypt.hash(plainPassword, saltRounds);

    user.password = hash;
    await user.save();
    return {
      ...user.dataValues,
      password: undefined,
      verificationCode: undefined,
    };
  }

  async resetPasswd(userDto: CreateUserDto) {
    const user = await this.findUser(userDto);
    const saltRounds = 10;
    const plainPassword = userDto.password;
    const hash = await bcrypt.hash(plainPassword, saltRounds);

    user.password = hash;
    await user.save();
    return {
      ...user.dataValues,
      password: undefined,
      verificationCode: undefined,
    };
  }

  async updatePasswd(userDto: CreateUserDto) {
    let user = await this.validateUser(userDto);
    if (user) {
      const saltRounds = 10;
      const newHash = await bcrypt.hash(userDto.newPassword, saltRounds);
      user = await this.findUser(userDto);
      user.updatedAt = new Date();
      user.password = newHash;
      await user.save();
      return {
        ...user.dataValues,
        password: undefined,
        verificationCode: undefined,
      };
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
