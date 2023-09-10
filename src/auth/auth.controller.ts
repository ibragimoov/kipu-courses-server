import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  Res,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ token: string }> {
    const token = await this.authService.login(loginDto);

    response.cookie('jwt', token, { httpOnly: false });

    return token;
  }

  @Get('/getme')
  getMe(@Req() request: Request): Promise<Admin> {
    const token = request.cookies['jwt'].token;

    return this.authService.getMe(token);
  }
}
