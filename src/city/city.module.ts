import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CityService } from './city.service';
import { CityResolver } from './city.resolver';
import { City } from './entities/city.entity';
@Module({
  imports: [TypeOrmModule.forFeature([City])],
  exports: [CityService],
  providers: [CityResolver, CityService],
})
export class CityModule {}
