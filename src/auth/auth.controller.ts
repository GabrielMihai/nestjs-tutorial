import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() authDto: AuthDto) {
    console.log({
      authDto,
    });
    return this.authService.signUp(authDto);
  }

  @Post('signIn')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
}
