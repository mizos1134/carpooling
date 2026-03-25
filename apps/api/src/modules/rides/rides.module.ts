import { Module } from '@nestjs/common';
import { RidesController } from './rides.controller.js';
import { RidesService } from './rides.service.js';

@Module({
  controllers: [RidesController],
  providers: [RidesService],
  exports: [RidesService],
})
export class RidesModule {}
