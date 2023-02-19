import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserDto } from './dto/user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';
import {
  sendVerificationEmail,
  sendVerificationSMS,
} from 'src/common/sendouter';
import { AddressesService } from './contacts/addresses.services';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  [x: string]: any;
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private addressesService: AddressesService,
    private rolesService: RolesService,
  ) {}

  async generateCustomerId(): Promise<string> {
    const timestamp = new Date().getTime().toString();
    const randomNumber = Math.floor(Math.random() * 1000000).toString();
    return `${timestamp}${randomNumber}`;
  }

  async createUserCustomerId(user: User) {
    if (user.customerId) {
      return user;
    }
    const customerId = await this.generateCustomerId();
    user.customerId = customerId;
    await user.save();
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id, {
      include: { all: true },
    });
    return user;
  }

  async getUserByOneProp(prop: string, value: string) {
    const user = await this.userRepository.findOne({
      where: { [prop]: value },
      include: { all: true },
    });
    return user;
  }

  async findUser(userDto: UserDto) {
    let user;
    if (userDto.email) {
      user = await this.getUserByOneProp('email', userDto.email);
    } else if (userDto.phoneNumber) {
      user = await this.getUserByOneProp('phoneNumber', userDto.phoneNumber);
    }
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

  async validateUser(userDto: UserDto) {
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

  async createUser(userDto: UserDto) {
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

  async saveVerificateCode(userDto: UserDto) {
    const user = await this.findUser(userDto);
    user.verificationCode = userDto.verificationCode;
    user.createdAt = new Date();
    await user.save();
    return user;
  }

  async activateUser(userDto: UserDto) {
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

  async setPasswd(userDto: UserDto) {
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

  async resetPasswd(userDto: UserDto) {
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

  async updatePasswd(userDto: UserDto) {
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

  async sendVerificateCodeToUser(userDto: UserDto, code: string) {
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

  async addAddress(userDto: any) {
    const user = await this.findUser(userDto);
    if (!user) {
      throw new UnauthorizedException({ message: 'User does not exist' });
    }
    const address = await this.addressesService.createAddress(userDto, user);
    return address;
  }

  async deleteAddress(userDto: any) {
    const address = await this.addressesService.deleteAddress(userDto);
    return address;
  }
  async getAddresses(userDto: any) {
    const user = await this.findUser(userDto);
    if (!user) {
      throw new UnauthorizedException({ message: 'User does not exist' });
    }
    const addresses = await this.addressesService.getAddresses(userDto, user);
    return addresses;
  }

  async addRole(userDto: any) {
    const user = await this.findUser(userDto);
    if (!user) {
      throw new UnauthorizedException({ message: 'User does not exist' });
    }
    const address = await this.rolesService.addRole(userDto, user);
    return address;
  }

  async getcustomerDto(userDto: any) {
    const user = await this.findUser(userDto);
    if (!user) {
      throw new UnauthorizedException({ message: 'User does not exist' });
    }
    await this.createUserCustomerId(user);
    await this.addressesService.getAddresses(userDto, user);
    const customerDto = {
      id: user.customerId,
      description: `Customer ${user.email}`,
      email: user.email,
    };
    return customerDto;
  }
}
