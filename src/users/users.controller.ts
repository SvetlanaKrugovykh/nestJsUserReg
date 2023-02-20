import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { User } from '../common/db/models/users.model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger/dist';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Add address' })
  @ApiResponse({ status: 200, type: User })
  @Post('/add-address')
  createAddress(@Body() userDto: UserDto) {
    return this.usersService.addAddress(userDto);
  }

  @ApiOperation({ summary: 'Get addresses' })
  @ApiResponse({ status: 200, type: User })
  @Post('/get-addresses')
  getAddresses(@Body() userDto: UserDto) {
    return this.usersService.getAddresses(userDto);
  }

  @ApiOperation({ summary: 'Delete addresses' })
  @ApiResponse({ status: 200, type: User })
  @Post('/delete-address')
  deleteAddres(@Body() userDto: UserDto) {
    return this.usersService.deleteAddress(userDto);
  }

  @ApiOperation({ summary: 'Add role' })
  @ApiResponse({ status: 200, type: User })
  @Post('/add-role')
  addRole(@Body() userDto: UserDto) {
    return this.usersService.addRole(userDto);
  }
}
