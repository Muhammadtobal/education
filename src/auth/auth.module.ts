import { JwtVendorStrategy } from './strategies/jwt-vendor.strategy';
import { JwtUserStrategy } from './strategies/jwt-user.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { JwtEmployeeStrategy } from './strategies/jwt-employee.strategy';
import { TeacherModule } from 'src/teacher/teacher.module';

@Module({
  imports: [
    JwtModule.register({ signOptions: { expiresIn: '1h' } }),
    UserModule,
    EmployeeModule,
    TeacherModule,
  ],
  exports: [AuthService],
  providers: [
    AuthService,
    AuthResolver,
    JwtVendorStrategy,
    JwtUserStrategy,
    JwtEmployeeStrategy,
  ],
})
export class AuthModule {}
