import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { FindAllUserInput } from './dto/find-all-user.input';
import { UserPaginationResultOutput } from './dto/find-all-user.output';

import { ErrorMessages } from 'src/shared/error-messages.object';
import { AuthService } from 'src/auth/auth.service';
import { CheckActivationCodeInput } from 'src/auth/dto/check-activation-code.input';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { GqlContext } from 'src/shared/types/context';
import { getUserId } from 'src/shared/helpers';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { booleanSchema } from 'src/shared/types/zod-schemas';
import { UpdateMeUserInput } from './dto/update-me-user.inputs';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { CheckActivationUserCodeOutput } from 'src/auth/dto/check-activation-user-code.output';
import { LoginHistoryService } from 'src/login_history/login_history.service';
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly loginHistoryService: LoginHistoryService,
  ) {}

  @Mutation(() => CheckActivationUserCodeOutput)
  public async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    const oldUser = await this.userService.findOne({
      phone: createUserInput.phone,
    });

    if (oldUser)
      throw new HttpException(
        ErrorMessages.USER_EXISTS_CONFLICT,
        HttpStatus.CONFLICT,
      );

    const activationCode = await this.userService.findOneActivationCode({
      phone: createUserInput.phone,
    });

    if (!activationCode || activationCode.code !== 'passed')
      throw new HttpException(
        ErrorMessages.ACTIVATION_CODE_UNAUTHORIZED,
        HttpStatus.CONFLICT,
      );

    const refreshToken = await this.authService.generateRefreshToken();
    const user = await this.userService.create({
      ...createUserInput,
      refresh_token: refreshToken,
    });

    const accessToken = await this.authService.generateJwtToken(
      { userId: user.id },
      process.env.USER_JWT_KEY as string,
    );
    this.userService.removeActivationCode(activationCode.id);
    if (createUserInput.device_info) {
      const device = createUserInput.device_info;

      const deviceKey = `${device.Platform}-${device.Brand}-${device.Model}-${device.Device}`;

      await this.loginHistoryService.create({
        user_id: user.id,
        device_info: createUserInput.device_info,
        device_key: deviceKey,
      });
    }
    return {
      user: { ...user },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 15 * 60,
    };
  }

  @Query(() => UserPaginationResultOutput, { name: 'users' })
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.GET + User.name)
  public findAll(@Args('filter') filter: FindAllUserInput) {
    return this.userService.findAll(filter);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.GET + User.name)
  public findOne(@Args('id') id: string) {
    return this.userService.findOne(
      { id },
      {
        relations: {
          city: true,
        },
      },
    );
  }

  // @Mutation(() => User)
  // @UseGuards(JwtAuthEmployeeGuard)
  // @Permissions(Operation.UPDATE + User.name)
  // public async updateUser(
  //   @Args("updateUserInput") updateUserInput: UpdateUserInput,
  // ) {
  //   const user = await this.userService.findOne(
  //     { id: updateUserInput.id },
  //     {
  //       selected: { id: true, active: true },
  //     },
  //   );

  //   if (!user)
  //     throw new HttpException(
  //       ErrorMessages.NOT_FOUND_USER,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   const updateUser = this.userService.update(updateUserInput);

  //   if (
  //     booleanSchema.safeParse(updateUserInput.active).success &&
  //     user.active !== updateUserInput.active
  //   ) {
  //     let body = { ar: "", en: "" };
  //     let title = { ar: "", en: "" };

  //     if (updateUserInput.active) {
  //       body = { ar: "تم تفعيل حسابك", en: "Your account has been activated" };
  //       title = { ar: "عملية تفعيل حساب", en: "Account activation" };
  //     } else {
  //       body = {
  //         ar: "تم إلغاء تفعيل حسابك",
  //         en: "Your account has been deactivated",
  //       };
  //       title = { ar: "عملية إيقاف الحساب", en: "Account deactivation" };
  //     }
  //     this.notificationService.sendNotificationToUser({
  //       user_id: updateUserInput.id,

  //       body: JSON.stringify(body),
  //       title: JSON.stringify(title),
  //       employee_id: " ",
  //       broker_id: " ",
  //     });
  //   }
  //   return updateUser;
  // }

  // @Mutation(() => User)
  // @UseGuards(JwtAuthUserGuard)
  // @Permissions(Operation.UPDATE + User.name)
  // public updateMeUser(
  //   @Args("updateMeInput") updateMeUserInput: UpdateMeUserInput,
  //   @Context() context: GqlContext,
  // ) {
  //   const userId = getUserId(context.req.user);

  //   return this.userService.update({
  //     id: userId,
  //     ...updateMeUserInput,
  //   });
  // }
}
