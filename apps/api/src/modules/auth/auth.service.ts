import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';

const DEV_OTP_CODE = '000000';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string }> {
    // Dev mode: no actual SMS sent
    this.logger.log(`[DEV] OTP for ${phone}: ${DEV_OTP_CODE}`);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, code: string): Promise<{ accessToken: string; user: Record<string, unknown> }> {
    // Dev mode: accept "000000"
    if (code !== DEV_OTP_CODE) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          firstName: '',
          lastName: '',
          isPhoneVerified: true,
          phoneVerifiedAt: new Date(),
        },
      });
      this.logger.log(`New user created: ${user.id}`);
    } else if (!user.isPhoneVerified) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isPhoneVerified: true,
          phoneVerifiedAt: new Date(),
        },
      });
    }

    const payload = { sub: user.id, phone: user.phone };
    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        gender: user.gender,
        bio: user.bio,
        city: user.city,
        preferredLanguage: user.preferredLanguage,
      },
    };
  }
}
