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
import { CreateUserDto } from 'src/users/dto/create-user.dto.v1';
import { User } from 'src/users/users.model';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/activate')
  async activate(@Body() userDto: CreateUserDto) {
    return this.authService.activate(userDto);
  }

  @ApiOperation({ summary: 'Validate user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/sign-in')
  async signIn(@Body() userDto: CreateUserDto) {
    return this.authService.signIn(userDto);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/sign-up')
  async signUp(@Body() userDto: CreateUserDto) {
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

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, type: User })
  @Post('/reset-passwd')
  async resetPasswd(@Body() userDto: CreateUserDto) {
    return this.authService.resetPasswd(userDto);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: User })
  //@UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req) {
    return this.authService.login(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
