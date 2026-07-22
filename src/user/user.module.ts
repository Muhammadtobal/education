import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { ActivationCode } from './entities/activation_code.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ActivationCode]),
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
  providers: [UserResolver, UserService],
})
export class UserModule {}
