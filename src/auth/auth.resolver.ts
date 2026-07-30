import { Resolver, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ErrorMessages } from 'src/shared/error-messages.object';
import { GqlContext } from 'src/shared/types/context';
import { CheckActivationCodeInput } from './dto/check-activation-code.input';
import { RefreshTokenOutput } from './dto/refresh-token.output';

import { isNumber } from 'class-validator';
import { RefreshTokenInput } from './dto/refresh-token.input';
import * as bcrypt from 'bcryptjs';

import { SendActivationCodeInput } from './dto/send-activation-code.input';
import { SendActivationCodeOutput } from './dto/send-activation-code.output';
import { AuthService } from './auth.service';
import { VendorService } from 'src/vendor/vendor.service';
import { UserService } from 'src/user/user.service';
import { CheckActivationTeacherCodeOutput } from './dto/check-activation-teacher-code.output';

import { CheckActivationUserCodeOutput } from './dto/check-activation-user-code.output';
import {
  decodeJwtToken,
  EmployeeJWTPayload,
  TeacherJWTPayload,
  UserJWTPayload,
  verifyJwtToken,
} from 'src/shared/types/jwt-payload';
import { EmployeeService } from 'src/employee/employee.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { CheckActivationEmployeeCodeOutput } from './dto/check-activation-employee-code.output';
import { LoginHistoryService } from 'src/login_history/login_history.service';
import { ConstantService } from 'src/constant/constant.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
    private readonly userService: UserService,
    private readonly teacherService: TeacherService,
    private readonly loginHistoryService: LoginHistoryService,
  ) {}
  @Mutation(() => RefreshTokenOutput)
  public async refreshTokenEmployee(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
    @Context() context: GqlContext,
  ) {
    if (!context.req.headers.authorization)
      throw new HttpException(
        ErrorMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const token = context.req.headers.authorization.split(' ')[1];

    let jwtData: EmployeeJWTPayload;

    try {
      jwtData = verifyJwtToken<EmployeeJWTPayload>(
        token,
        process.env.EMPLOYEE_JWT_KEY!,
      );
    } catch (err: any) {
      if (err.message === 'TOKEN_EXPIRED') {
        decodeJwtToken(token);

        jwtData = verifyJwtToken<EmployeeJWTPayload>(
          token,
          process.env.EMPLOYEE_JWT_KEY!,
          true,
        );
      } else {
        throw err;
      }
    }

    const employee = await this.employeeService.findOne(
      {
        id: jwtData.empId,
        refresh_token: refreshTokenInput.refresh_token,
      },
      {
        relations: {
          employee_vendors: true,
        },
      },
    );

    if (!employee)
      throw new HttpException(
        ErrorMessages.NOT_FOUND_USER,
        HttpStatus.NOT_FOUND,
      );

    const accessToken = await this.authService.generateJwtToken(
      {
        empId: employee.id,
        employee_vendors: employee.employee_vendors.map((v) => ({
          vendor_id: v.vendor_id,
        })),
      },
      process.env.EMPLOYEE_JWT_KEY!,
    );
    return {
      access_token: accessToken,
      expires_in: 15 * 60,
    };
  }

  @Mutation(() => CheckActivationEmployeeCodeOutput)
  public async checkEmployeeActivationCode(
    @Args('checkActivationCodeInput')
    checkActivationCodeInput: CheckActivationCodeInput,
  ) {
    const activationCode = await this.userService.findOneActivationCode({
      phone: checkActivationCodeInput.phone,
      code: checkActivationCodeInput.code,
    });

    if (!activationCode || !isNumber(Number(activationCode.code)))
      throw new HttpException(
        ErrorMessages.ACTIVATION_CODE_CONFLICT,
        HttpStatus.CONFLICT,
      );

    await this.userService.updateActivationCode({
      id: activationCode.id,
      code: 'passed',
    });

    const employee = await this.employeeService.findOne(
      {
        phone: checkActivationCodeInput.phone,
        active: true,
      },
      {
        relations: {
          employee_permissions: { permission: true },
          employee_vendors: true,
        },
      },
    );

    if (!employee) return {};

    const accessToken = await this.authService.generateJwtToken(
      {
        empId: employee.id,
        employee_vendors: employee.employee_vendors.map((v) => ({
          vendor_id: v.vendor_id,
        })),
      },
      process.env.EMPLOYEE_JWT_KEY!,
    );
    const refreshToken = await this.authService.generateRefreshToken();

    await this.employeeService.update({
      id: employee.id,
      refresh_token: refreshToken,
      fcm_token: checkActivationCodeInput.fcm_token,
    });

    await this.userService.removeActivationCode(activationCode.id);

    return {
      employee,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 15 * 60,
    };
  }
  @Mutation(() => SendActivationCodeOutput)
  public async sendActivationCode(
    @Args('sendActivationCodeInput')
    sendActivationCodeInput: SendActivationCodeInput,
  ) {
    const activationCode = this.authService.generateActivationCode().toString();

    // if (sendActivationCodeInput.phone !== "+963900112233")
    //   this.appService.sendSMS(
    //     "كود التفعيل الخاص بك هو " + `${activationCode}`,
    //     sendActivationCodeInput.phone.slice(1),
    //     sendActivationCodeInput.autofill_code,
    //   );

    const sentActivationCode = await this.userService.findOneActivationCode({
      phone: sendActivationCodeInput.phone,
    });

    if (sentActivationCode)
      await this.userService.updateActivationCode({
        id: sentActivationCode.id,
        code: activationCode,
      });
    else
      await this.userService.createActivationCode({
        phone: sendActivationCodeInput.phone,
        code: activationCode,
      });

    return {
      sent: process.env.NODE_ENV === 'production',
      code: process.env.NODE_ENV === 'production' ? null : activationCode,
    };
  }

  @Mutation(() => RefreshTokenOutput)
  public async refreshTokenTeacher(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
    @Context() context: GqlContext,
  ) {
    if (!context.req.headers.authorization)
      throw new HttpException(
        ErrorMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const token = context.req.headers.authorization.split(' ')[1];

    let jwtData: TeacherJWTPayload;

    try {
      jwtData = verifyJwtToken<TeacherJWTPayload>(
        token,
        process.env.TEACHER_JWT_KEY!,
      );
    } catch (err: any) {
      if (err.message === 'TOKEN_EXPIRED') {
        decodeJwtToken(token);

        jwtData = verifyJwtToken<TeacherJWTPayload>(
          token,
          process.env.TEACHER_JWT_KEY!,
          true,
        );
      } else {
        throw err;
      }
    }

    const teacher = await this.teacherService.findOne({
      id: jwtData.teacherId,
      refresh_token: refreshTokenInput.refresh_token,
    });

    if (!teacher)
      throw new HttpException(
        ErrorMessages.NOT_FOUND_USER,
        HttpStatus.NOT_FOUND,
      );

    const accessToken = await this.authService.generateJwtToken(
      { teacherId: teacher.id },
      process.env.TEACHER_JWT_KEY as string,
    );

    return {
      access_token: accessToken,
      expires_in: 15 * 60,
    };
  }

  @Mutation(() => CheckActivationTeacherCodeOutput)
  public async checkTeacherActivationCode(
    @Args('checkActivationCodeInput')
    checkActivationCodeInput: CheckActivationCodeInput,
  ) {
    const activationCode = await this.userService.findOneActivationCode({
      phone: checkActivationCodeInput.phone,
      code: checkActivationCodeInput.code,
    });

    if (!activationCode || !isNumber(Number(activationCode.code)))
      throw new HttpException(
        ErrorMessages.ACTIVATION_CODE_CONFLICT,
        HttpStatus.CONFLICT,
      );

    await this.userService.updateActivationCode({
      id: activationCode.id,
      code: 'passed',
    });

    const teacher = await this.teacherService.findOne({
      phone: checkActivationCodeInput.phone,
    });

    if (!teacher) return {};

    const accessToken = await this.authService.generateJwtToken(
      { teacherId: teacher.id },
      process.env.TEACHER_JWT_KEY as string,
    );

    const refreshToken = await this.authService.generateRefreshToken();

    await this.teacherService.update({
      id: teacher.id,
      refresh_token: refreshToken,
      fcm_token: checkActivationCodeInput.fcm_token,
    });

    await this.userService.removeActivationCode(activationCode.id);

    return {
      teacher,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 15 * 60,
    };
  }
  @Mutation(() => RefreshTokenOutput)
  public async refreshTokenUser(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
    @Context() context: GqlContext,
  ) {
    if (!context.req.headers.authorization)
      throw new HttpException(
        ErrorMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    const token = context.req.headers.authorization.split(' ')[1];

    let jwtData: UserJWTPayload;

    try {
      jwtData = verifyJwtToken<UserJWTPayload>(
        token,
        process.env.USER_JWT_KEY!,
      );
    } catch (err: any) {
      if (err.message === 'TOKEN_EXPIRED') {
        decodeJwtToken(token);
        jwtData = verifyJwtToken<UserJWTPayload>(
          token,
          process.env.USER_JWT_KEY!,
          true,
        );
      } else {
        throw err;
      }
    }
    const user = await this.userService.findOne({
      id: jwtData.userId,
      refresh_token: refreshTokenInput.refresh_token,
    });

    if (!user)
      throw new HttpException(
        ErrorMessages.NOT_FOUND_USER,
        HttpStatus.NOT_FOUND,
      );

    const accessToken = await this.authService.generateJwtToken(
      { userId: user.id },
      process.env.USER_JWT_KEY as string,
    );

    return { access_token: accessToken, expires_in: 15 * 60 };
  }

  @Mutation(() => CheckActivationUserCodeOutput)
  public async checkUserActivationCode(
    @Args('checkActivationCodeInput')
    checkActivationCodeInput: CheckActivationCodeInput,
  ) {
    const activationCode = await this.userService.findOneActivationCode({
      phone: checkActivationCodeInput.phone,
      code: checkActivationCodeInput.code,
    });

    if (!activationCode || !isNumber(Number(activationCode.code)))
      throw new HttpException(
        ErrorMessages.ACTIVATION_CODE_CONFLICT,
        HttpStatus.CONFLICT,
      );

    await this.userService.updateActivationCode({
      id: activationCode.id,
      code: 'passed',
    });

    const user = await this.userService.findOne(
      {
        phone: checkActivationCodeInput.phone,
      },
      { relations: { level: true, city: true } },
    );

    if (!user) return {};

    let deviceKey: string | null = null;

    if (checkActivationCodeInput.device_info) {
      const device = checkActivationCodeInput.device_info;

      deviceKey = `${device.Platform}-${device.Brand}-${device.Model}-${device.Device}`;

      const hasFrequentDeviceChanges =
        await this.loginHistoryService.hasFrequentDeviceChanges(
          user.id,
          deviceKey,
        );

      if (hasFrequentDeviceChanges) {
        if (!user.allow_device_change_once) {
          throw new HttpException(
            ErrorMessages.DEVICE_CHANGED_MULTIPLE_TIMES,
            HttpStatus.FORBIDDEN,
          );
        }

        await this.userService.update({
          id: user.id,
          allow_device_change_once: false,
        });

        user.allow_device_change_once = false;
      }
    }

    const accessToken = await this.authService.generateJwtToken(
      { userId: user.id },
      process.env.USER_JWT_KEY as string,
    );

    const refreshToken = await this.authService.generateRefreshToken();

    await this.userService.update({
      id: user.id,
      refresh_token: refreshToken,
      device_info: checkActivationCodeInput.device_info,
      fcm_token: checkActivationCodeInput.fcm_token,
    });

    await this.userService.removeActivationCode(activationCode.id);
    if (deviceKey) {
      await this.loginHistoryService.create({
        user_id: user.id,
        device_info: checkActivationCodeInput.device_info,
        device_key: deviceKey,
      });
    }

    user.device_info = checkActivationCodeInput.device_info;
    user.refresh_token = refreshToken;
    user.fcm_token = checkActivationCodeInput.fcm_token;

    return {
      user: user,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 15 * 60,
    };
  }
}
