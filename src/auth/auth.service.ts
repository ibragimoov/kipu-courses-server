import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/admin/entities/admin.entity';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { login, password } = signUpDto;

    const candidate = await this.adminModel.findOne({ login });

    if (candidate) {
      throw new BadRequestException('Логин уже используется');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.adminModel.create({
      login,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { login, password } = loginDto;

    const admin = await this.adminModel.findOne({ login });

    if (!admin) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const isPasswordMatched = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const token = this.jwtService.sign({ id: admin._id });

    return { token };
  }

  async getMe(token: string): Promise<any> {
    if (!token) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const decodedToken = this.jwtService.verifyAsync(token);

    if (!decodedToken) {
      throw new UnauthorizedException('Токен истёк');
    }

    const admin = await this.adminModel.findOne({ id: decodedToken['id'] });

    if (!admin) {
      throw new BadRequestException('Такого пользователя не существует');
    }

    return admin;
  }
}
