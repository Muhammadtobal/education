import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coupon } from "./entities/coupon.entity";
import { CouponService } from "./coupon.service";
import { CouponResolver } from "./coupon.resolver";
import { UserCoupon } from "./entities/user_coupon.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, UserCoupon])],
  exports: [CouponService],
  providers: [CouponService, CouponResolver],
})
export class CouponModule {}
