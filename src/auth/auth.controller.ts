import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger/dist';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/users.model';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/activate')
  async activate(@Body() userDto: UserDto) {
    return this.authService.activate(userDto);
  }

  @ApiOperation({ summary: 'Validate user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async login(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/sign-up')
  async signUp(@Body() userDto: UserDto) {
    return this.authService.signUp(userDto);
  }

  @ApiOperation({ summary: 'Set password' })
  @ApiResponse({ status: 200, type: User })
  @Post('/set-passwd')
  async setPasswd(@Body() userDto: UserDto) {
    return this.authService.setPasswd(userDto);
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, type: User })
  @Post('/update-passwd')
  async updatePasswd(@Body() userDto: UserDto) {
    return this.authService.updatePasswd(userDto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, type: User })
  @Post('/reset-passwd')
  async resetPasswd(@Body() userDto: UserDto) {
    return this.authService.resetPasswd(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
