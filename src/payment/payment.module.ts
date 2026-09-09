import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { CouponModule } from 'src/coupon/coupon.module';
import { PaymentCodeModule } from 'src/payment_code/payment_code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    CouponModule,
    PaymentCodeModule,
  ],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentModule {}
