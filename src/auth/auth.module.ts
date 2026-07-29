import { JwtAuthEmployeeGuard } from './guards/jwt-auth-employee.guard';
import { JwtUserStrategy } from './strategies/jwt-user.strategy';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { JwtEmployeeStrategy } from './strategies/jwt-employee.strategy';
import { TeacherModule } from 'src/teacher/teacher.module';
import { JwtTeacherStrategy } from './strategies/jwt-teacher.strategy';
import { LoginHistoryModule } from 'src/login_history/login_history.module';

@Module({
  imports: [
    JwtModule.register({ signOptions: { expiresIn: '1h' } }),
    forwardRef(() => UserModule),
    forwardRef(() => EmployeeModule),
    LoginHistoryModule,
    forwardRef(() => TeacherModule),
  ],
  exports: [AuthService],
  providers: [
    AuthService,
    AuthResolver,

    JwtUserStrategy,
    JwtEmployeeStrategy,
    JwtTeacherStrategy,
  ],
})
export class AuthModule {}
