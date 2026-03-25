import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SearchRidesDto } from './dto/search-rides.dto.js';

type RideIdRow = { id: string };

@Injectable()
export class RidesService {
  private readonly logger = new Logger(RidesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async searchRides(dto: SearchRidesDto) {
    const {
      originLat,
      originLng,
      destLat,
      destLng,
      date,
      passengers = 1,
      sort = 'departure',
    } = dto;

    this.logger.log(
      `Searching rides: origin=(${originLat},${originLng}) dest=(${destLat},${destLng}) date=${date} passengers=${passengers} sort=${sort}`,
    );

    // PostGIS spatial filter — Prisma cannot query geography columns directly
    const rideIdRows = await this.prisma.$queryRaw<RideIdRow[]>`
      SELECT r.id
      FROM rides r
      WHERE ST_DWithin(
        r.origin_location,
        ST_SetSRID(ST_MakePoint(${parseFloat(originLng)}, ${parseFloat(originLat)}), 4326)::geography,
        50000
      )
      AND ST_DWithin(
        r.destination_location,
        ST_SetSRID(ST_MakePoint(${parseFloat(destLng)}, ${parseFloat(destLat)}), 4326)::geography,
        50000
      )
      AND DATE(r.departure_at) = ${date}::date
      AND r.seats_available >= ${passengers}
      AND r.status = 'published'
    `;

    const rideIds = rideIdRows.map((row) => row.id);

    if (rideIds.length === 0) {
      return { success: true, data: [], meta: { total: 0 } };
    }

    const rides = await this.prisma.ride.findMany({
      where: { id: { in: rideIds } },
      include: {
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            ratingAsDriver: true,
            totalRidesAsDriver: true,
          },
        },
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
            color: true,
          },
        },
        stops: {
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: {
            bookings: {
              where: { status: { in: ['pending', 'confirmed'] } },
            },
          },
        },
      },
    });

    // Sort in JS (PostGIS raw query doesn't propagate order to findMany)
    const sorted = [...rides].sort((a, b) => {
      switch (sort) {
        case 'price':
          return Number(a.pricePerSeat) - Number(b.pricePerSeat);
        case 'rating':
          return (
            Number(b.driver.ratingAsDriver) - Number(a.driver.ratingAsDriver)
          );
        case 'departure':
        default:
          return (
            new Date(a.departureAt).getTime() -
            new Date(b.departureAt).getTime()
          );
      }
    });

    return {
      success: true,
      data: sorted,
      meta: { total: sorted.length },
    };
  }

  async getRideById(id: string) {
    this.logger.log(`Fetching ride detail: id=${id}`);

    const ride = await this.prisma.ride.findUnique({
      where: { id },
      include: {
        driver: {
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
            createdAt: true,
            driverProfile: {
              select: {
                smokingAllowed: true,
                musicAllowed: true,
                chatPreference: true,
                autoApproveBookings: true,
              },
            },
          },
        },
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
            color: true,
            totalSeats: true,
            photoUrl: true,
          },
        },
        stops: {
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: {
            bookings: {
              where: { status: { in: ['pending', 'confirmed'] } },
            },
          },
        },
      },
    });

    if (!ride || ride.status === 'cancelled') {
      throw new NotFoundException('Ride not found');
    }

    return { success: true, data: ride };
  }
}
