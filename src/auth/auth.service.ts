import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async signUp(authDto: AuthDto) {
    const hash = await argon.hash(authDto.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          hash,
        },
      });

      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  async signIn(authDto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if (!user) {
      throw new InternalServerErrorException(
        `User with email ${authDto.email} not found`,
      );
    }

    const passwordMatches = await argon.verify(user.hash, authDto.password);
    if (!passwordMatches) {
      throw new InternalServerErrorException('Password is incorrect');
    }
    delete user.hash;
    return user;
  }
}
