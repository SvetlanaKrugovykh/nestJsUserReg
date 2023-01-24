import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  signUp(@Body() userDto: CreateUserDto) {
    return this.authService.signUp(userDto);
  }

  @Post('/verifyUser')
  async verifyUser(@Body() userDto: CreateUserDto) {
    return this.authService.sendVerificateCodeUser(userDto);
  }

  @Post('/passwdRecovery')
  async passwdRecovery(@Body() userDto: CreateUserDto) {
    return this.authService.passwdRecovery(userDto);
  }
}
