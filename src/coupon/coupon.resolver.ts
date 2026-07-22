import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CouponService } from './coupon.service';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponInput } from './dto/create-coupon.input';
import { UpdateCouponInput } from './dto/update-coupon.input';
import { CouponPaginationResultOutput } from './dto/find-all-coupon.output';
import { FindAllCouponInput } from './dto/find-all-coupon.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { UseGuards } from '@nestjs/common';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { CreateUserCouponInput } from './dto/create-user_coupon.input';
import { UserCoupon } from './entities/user_coupon.entity';
import { CheckActivationCouponInput } from './dto/check-activation-coupon.input';
import { GqlContext } from 'src/shared/types/context';
import { getUserId } from 'src/shared/helpers';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';

@Resolver(() => Coupon)
export class CouponResolver {
  constructor(private readonly couponService: CouponService) {}

  @Mutation(() => Coupon)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + Coupon.name)
  public createCoupon(
    @Args('createCouponInput') createCouponInput: CreateCouponInput,
  ) {
    return this.couponService.create(createCouponInput);
  }

  @Query(() => CouponPaginationResultOutput, { name: 'coupons' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Coupon.name)
  public findAll(@Args('filter') filter: FindAllCouponInput) {
    return this.couponService.findAll(filter);
  }

  @Query(() => Coupon, { name: 'coupon' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Coupon.name)
  public findOne(@Args('id') id: string) {
    return this.couponService.findOne({ id });
  }

  @Mutation(() => Coupon)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.UPDATE + Coupon.name)
  public updateCoupon(
    @Args('updateCouponInput') updateCouponInput: UpdateCouponInput,
  ) {
    return this.couponService.update(updateCouponInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.DELETE + Coupon.name)
  public removeCoupon(@Args('id') id: string) {
    this.couponService.remove(id);
    return { done: true };
  }

  @Mutation(() => UserCoupon)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + UserCoupon.name)
  public createUserCoupon(
    @Args('createUserCouponInput') createUserCouponInput: CreateUserCouponInput,
  ) {
    return this.couponService.createUserCoupon(createUserCouponInput);
  }

  @Mutation(() => Coupon)
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.CREATE + UserCoupon.name)
  public async checkActivationCoupon(
    @Args('checkActivationCouponInput')
    checkActivationCouponInput: CheckActivationCouponInput,
    @Context() context: GqlContext,
  ) {
    const userId = getUserId(context.req.user);
    return await this.couponService.checkActivationCoupon(
      checkActivationCouponInput,
      userId,
    );
  }
}
