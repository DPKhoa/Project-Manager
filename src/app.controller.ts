import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}
  @Post('register')
  async register(
    @Body()
    body: {
      lastName: string;
      role: boolean;
      userName: string;
      passWord: string;
      phone: string;
    },
  ) {
    const user = await this.userService.create(body);
    delete user.passWord;
    return {
      lastName: user.lastName,
      role: user.role,
      userName: user.userName,
      passWord: user.passWord,
      phone: user.phone,
    };
  }
  @Post('login')
  async Login(
    @Body('userName') userName: string,
    @Body('passWord') passWord: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.appService.findOneBy({ userName });

    if (!user) {
      throw new BadRequestException('Làm del gì có');
    }

    const bcryptCheck = await bcrypt.compare(passWord, user.passWord);

    if (!bcryptCheck) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'Success!!!',
    };
  }

  @Get('user')
  async User(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.appService.findOneBy({ id: data['id'] });

      const { passWord, ...result } = user;
      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'success!!!',
    };
  }
}
