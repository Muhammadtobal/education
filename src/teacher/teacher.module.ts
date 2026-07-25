import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { TeacherService } from './teacher.service';
import { TeacherResolver } from './teacher.resolver';
import { TeacherVendor } from './entities/teacher-vedor.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher, TeacherVendor]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  exports: [TeacherService],
  providers: [TeacherService, TeacherResolver],
})
export class TeacherModule {}
