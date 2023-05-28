import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import RegistrationDto from './dto/registeration.dto';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from '../database/postgresErrorcode.enum';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  public async register(registerData: RegistrationDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerData.password, 10);
      const newUser = {
        ...registerData,
        password: hashedPassword,
      };
      console.log(newUser);
      const createdUser = await this.usersService.create(newUser);
      createdUser.password = undefined;
      console.log(createdUser);
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      console.log(user);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    console.log(hashedPassword);
    console.log(plainTextPassword);
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
