import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger/dist';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.model';
import { AuthService } from './auth.service';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/activate')
  activate(@Body() userDto: CreateUserDto) {
    return this.authService.activate(userDto);
  }

  @ApiOperation({ summary: 'Validate user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/sign-in')
  signIn(@Body() userDto: CreateUserDto) {
    return this.authService.signIn(userDto);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/sign-up')
  signUp(@Body() userDto: CreateUserDto) {
    return this.authService.signUp(userDto);
  }

  @ApiOperation({ summary: 'Set password' })
  @ApiResponse({ status: 200, type: User })
  @Post('/set-passwd')
  async setPasswd(@Body() userDto: CreateUserDto) {
    return this.authService.setPasswd(userDto);
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, type: User })
  @Post('/update-passwd')
  async updatePasswd(@Body() userDto: CreateUserDto) {
    return this.authService.updatePasswd(userDto);
  }
}
