import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginHistory } from './entities/login_history.entity';
import { LoginHistoryService } from './login_history.service';
import { LoginHistoryResolver } from './login_history.resolver';
import { ConstantModule } from 'src/constant/constant.module';

@Module({
  imports: [TypeOrmModule.forFeature([LoginHistory]), ConstantModule],
  exports: [LoginHistoryService],
  providers: [LoginHistoryService, LoginHistoryResolver],
})
export class LoginHistoryModule {}
