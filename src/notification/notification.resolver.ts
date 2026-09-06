import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { FindOptionsWhere } from 'typeorm';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { NotificationPaginationResultOutput } from './dto/find-all-notification.output';
import { FindAllNotificationInput } from './dto/find-all-notification.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { booleanSchema, stringSchema } from 'src/shared/types/zod-schemas';
import { CityService } from 'src/city/city.service';
import { ErrorMessages } from 'src/shared/error-messages.object';
import { getEmpId, getEmpVendors } from 'src/shared/helpers';
import { GqlContext } from 'src/shared/types/context';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly cityService: CityService,
  ) {}

  @Mutation(() => Notification)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + Notification.name)
  public async createNotification(
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
    @Context() context: GqlContext,
  ) {
    console.log(createNotificationInput);
    const countsFilter: FindOptionsWhere<User> = {};
    let memberCount;
    if (createNotificationInput.user_id) {
      await this.notificationService.sendNotificationToUser({
        ...createNotificationInput,
      });
    }

    if (createNotificationInput.filter_data?.city?.id)
      countsFilter.city_id = createNotificationInput.filter_data.city.id;
    if (createNotificationInput.filter_data?.is_user)
      memberCount = await this.userService.count(countsFilter);
    if (
      stringSchema.safeParse(createNotificationInput.filter_data?.city?.id)
        .success
    ) {
      const city = await this.cityService.findOne({
        id: createNotificationInput.filter_data?.city?.id,
      });

      if (!city)
        throw new HttpException(
          ErrorMessages.NOT_FOUND_USER,
          HttpStatus.NOT_FOUND,
        );

      if (createNotificationInput.filter_data)
        createNotificationInput.filter_data.city = { ...city };
    }

    const notification = this.notificationService.create({
      ...createNotificationInput,
      receivers_count: memberCount,
      global: true,
      employee_id: getEmpId(context.req.user),
    });

    if (
      booleanSchema.safeParse(createNotificationInput.approved).success &&
      createNotificationInput.approved
    )
      if (createNotificationInput.filter_data?.is_user === true)
        this.notificationService.sendToUserCriteria(createNotificationInput);

    return notification;
  }

  @Query(() => NotificationPaginationResultOutput, { name: 'notifications' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Notification.name)
  public findAll(@Args('filter') filter: FindAllNotificationInput) {
    return this.notificationService.findAll(filter);
  }

  @Query(() => Notification, { name: 'notification' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Notification.name)
  public findOne(@Args('id') id: string) {
    return this.notificationService.findOne(
      { id },
      { relations: { employee: true, user: true } },
    );
  }

  @Mutation(() => Notification)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.UPDATE + Notification.name)
  public updateNotification(
    @Args('updateNotificationInput')
    updateNotificationInput: UpdateNotificationInput,
  ) {
    return this.notificationService.update(updateNotificationInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.DELETE + Notification.name)
  public removeNotification(@Args('id') id: string) {
    this.notificationService.remove(id);
    return {
      done: true,
    };
  }

  @Mutation(() => Notification)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + Notification.name)
  public sendNotification(
    @Args('sendNotification')
    data: CreateNotificationInput,
  ) {
    return this.notificationService.sendNotificationToUser(data);
  }
}
