import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

const USER_PUBLIC_SELECT = {
  id: true,
  phone: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  gender: true,
  bio: true,
  city: true,
  preferredLanguage: true,
  ratingAsDriver: true,
  ratingAsPassenger: true,
  totalRidesAsDriver: true,
  totalRidesAsPassenger: true,
  isPhoneVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: USER_PUBLIC_SELECT,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: USER_PUBLIC_SELECT,
    });
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        bio: true,
        city: true,
        ratingAsDriver: true,
        ratingAsPassenger: true,
        totalRidesAsDriver: true,
        totalRidesAsPassenger: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
