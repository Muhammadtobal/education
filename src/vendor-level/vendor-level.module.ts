import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VendorLevel } from "./entities/vendor-level.entity";
import { VendorLevelService } from "./vendor-level.service";
import { VendorLevelResolver } from "./vendor-level.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([VendorLevel])],
  providers: [VendorLevelService, VendorLevelResolver],
})
export class VendorLevelModule {}