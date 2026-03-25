import { Controller, Get, Param, Query } from '@nestjs/common';
import { RidesService } from './rides.service.js';
import { SearchRidesDto } from './dto/search-rides.dto.js';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Get()
  async searchRides(@Query() query: SearchRidesDto) {
    return this.ridesService.searchRides(query);
  }

  @Get(':id')
  async getRideById(@Param('id') id: string) {
    return this.ridesService.getRideById(id);
  }
}
