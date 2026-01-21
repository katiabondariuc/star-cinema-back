// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/services/user.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MainRoleEnum } from '../../shared/enums/main-role.enum';
import { compare } from 'bcrypt';
import { JwtUserPayload } from '../../shared/interface/jwt-userpayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.userService.create(dto);

    return this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role as MainRoleEnum,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  private generateToken(user: JwtUserPayload) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}