import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorLevel } from './entities/vendor_level.entity';
import { VendorLevelService } from './vendor_level.service';
import { VendorLevelResolver } from './vendor_level.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([VendorLevel])],
  providers: [VendorLevelService, VendorLevelResolver],
})
export class VendorLevelModule {}
