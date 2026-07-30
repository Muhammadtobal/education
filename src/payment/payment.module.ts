import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { CouponModule } from 'src/coupon/coupon.module';
import { EmployeeVendorModule } from 'src/employee_vendor/employee_vendor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    CouponModule,
    EmployeeVendorModule,
  ],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentModule {}
