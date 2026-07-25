import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConstantService } from './constant.service';
import { ConstantResolver } from './constant.resolver';
import { Constant } from './entities/constant.entity';
import { AppModule } from 'src/app.module';

@Module({
  imports: [TypeOrmModule.forFeature([Constant]), forwardRef(() => AppModule)],
  providers: [ConstantResolver, ConstantService],
  exports: [ConstantService],
})
export class ConstantModule {}
