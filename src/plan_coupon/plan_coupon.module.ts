import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanCoupon } from './entities/plan_coupon.entity';
import { PlanCouponService } from './plan_coupon.service';
import { PlanCouponResolver } from './plan_coupon.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PlanCoupon])],
  exports: [PlanCouponService],
  providers: [PlanCouponService, PlanCouponResolver],
})
export class PlanCouponModule {}
