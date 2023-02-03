import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserDto } from '../dto/user.dto';
import { User } from '../users.model';
import { Country } from './countries.model';
import { Region } from './regions.model';
import { City } from './cities.model';
import { Address } from './addresses.model';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Country) private countryRepository: typeof Country,
    @InjectModel(Region) private regionRepository: typeof Region,
    @InjectModel(City) private cityRepository: typeof City,
    @InjectModel(Address) private addressRepository: typeof Address,
    @InjectModel(User) private UserRepository: typeof User,
  ) {}

  public async getAddresses(userDto: UserDto, user: User) {
    try {
      const addresses = await this.addressRepository.findAll({
        where: { userId: user.id },
        include: { all: true },
      });
      return addresses;
    } catch (e) {
      throw new UnauthorizedException({
        message: e.message,
      });
    }
  }
  public async deleteAddress(userDto: UserDto) {
    try {
      const address = await this.addressRepository.findOne({
        where: {
          userId: Number(userDto.userId),
          street: userDto.street,
          house: userDto.house,
          apartment: userDto.apartment,
        },
      });
      if (!address) {
        throw new NotFoundException({
          message: 'Address not found',
        });
      }
      const addressID = address.id;
      await this.addressRepository.destroy({ where: { id: addressID } });
      return { message: 'Address deleted successfully' };
    } catch (e) {
      throw new UnauthorizedException({
        message: e.message,
      });
    }
  }

  public async createAddress(userDto: UserDto, user: User) {
    try {
      let country = await this.countryRepository.findOne({
        where: { name: userDto.country },
      });
      if (!country) {
        country = await this.countryRepository.create({
          name: userDto.country,
        });
      }
      let region = await this.regionRepository.findOne({
        where: { name: userDto.region },
      });
      if (!region) {
        region = await this.regionRepository.create({
          name: userDto.region,
          countryId: country.id,
        });
      }
      let city = await this.cityRepository.findOne({
        where: { name: userDto.city },
      });
      if (!city) {
        city = await this.cityRepository.create({
          name: userDto.city,
          countryId: country.id,
          regionId: region.id,
        });
      }
      const address = await this.addressRepository.create({
        street: userDto.street,
        house: userDto.house,
        apartment: userDto.apartment,
        cityId: city.id,
        countryId: country.id,
        regionId: region.id,
        userId: user.id,
      });
      return address;
    } catch (e) {
      throw new UnauthorizedException({
        message: e.message,
      });
    }
  }
}
