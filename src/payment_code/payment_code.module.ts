import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentCode } from './entities/payment_code.entity';
import { PaymentCodeService } from './payment_code.service';
import { PaymentCodeResolver } from './payment_code.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentCode])],
  exports: [PaymentCodeService],
  providers: [PaymentCodeService, PaymentCodeResolver],
})
export class PaymentCodeModule {}
