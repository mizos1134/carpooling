import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    const { rideId, pickupStopId, dropoffStopId, seatsReserved, paymentMethod } = dto;

    this.logger.log(`Creating booking: rideId=${rideId} userId=${userId} seats=${seatsReserved}`);

    // 1. Fetch ride — must exist and be published or full
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
      include: { stops: true },
    });

    if (!ride || (ride.status !== 'published' && ride.status !== 'full')) {
      throw new NotFoundException('Ride not found or not available for booking');
    }

    // 2. Check seat availability
    if (ride.seatsAvailable < seatsReserved) {
      throw new BadRequestException('Not enough seats available');
    }

    // 3. Check passenger not already booked on this ride
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        rideId,
        passengerId: userId,
        status: { notIn: ['rejected', 'cancelled'] },
      },
    });

    if (existingBooking) {
      throw new ConflictException('Already booked');
    }

    // 4. Validate stops belong to this ride
    const stopIds = ride.stops.map((s) => s.id);
    if (!stopIds.includes(pickupStopId)) {
      throw new BadRequestException('pickupStopId does not belong to this ride');
    }
    if (!stopIds.includes(dropoffStopId)) {
      throw new BadRequestException('dropoffStopId does not belong to this ride');
    }

    // 5. Passenger must not be the driver
    if (ride.driverId === userId) {
      throw new BadRequestException('Cannot book your own ride');
    }

    // Compute total price using Decimal arithmetic to avoid float imprecision
    const pricePerSeat = new Decimal(ride.pricePerSeat);
    const totalPrice = pricePerSeat.mul(seatsReserved);

    const newSeatsAvailable = ride.seatsAvailable - seatsReserved;

    // 6. Transactional create booking + update ride seats
    const [booking] = await this.prisma.$transaction([
      this.prisma.booking.create({
        data: {
          rideId,
          passengerId: userId,
          pickupStopId,
          dropoffStopId,
          seatsReserved,
          pricePerSeat: ride.pricePerSeat,
          totalPrice,
          currency: ride.currency,
          paymentMethod: paymentMethod ?? 'cash',
        },
      }),
      this.prisma.ride.update({
        where: { id: rideId },
        data: {
          seatsAvailable: { decrement: seatsReserved },
          ...(newSeatsAvailable === 0 ? { status: 'full' } : {}),
        },
      }),
    ]);

    return { success: true, data: booking };
  }
}
