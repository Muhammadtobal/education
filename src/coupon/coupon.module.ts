import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponService } from './coupon.service';
import { CouponResolver } from './coupon.resolver';
import { UserCoupon } from './entities/user_coupon.entity';
import { PlanCouponModule } from 'src/plan_coupon/plan_coupon.module';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, UserCoupon]), PlanCouponModule],
  exports: [CouponService],
  providers: [CouponService, CouponResolver],
})
export class CouponModule {}
