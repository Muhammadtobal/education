import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { SubscriptionService } from './subscription.service';
import { Subscription } from './entities/subscription.entity';

import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { SubscriptionPaginationResultOutput } from './dto/find-all-subscription.output';
import { FindAllSubscriptionInput } from './dto/find-all-subscription.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { CheckContentAccessInput } from './dto/check-access-content.inputs';
import { CheckAccessOutput } from './dto/check-access-content.output';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { GqlContext } from 'src/shared/types/context';
import { getUserId } from 'src/shared/helpers';

@Resolver(() => Subscription)
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Mutation(() => Subscription)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Subscription.name)
  public createSubscription(
    @Args('createSubscriptionInput')
    createSubscriptionInput: CreateSubscriptionInput,
  ) {
    return this.subscriptionService.create(createSubscriptionInput);
  }

  @Query(() => SubscriptionPaginationResultOutput, { name: 'subscriptions' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Subscription.name)
  public findAll(@Args('filter') filter: FindAllSubscriptionInput) {
    return this.subscriptionService.findAll(filter);
  }

  @Query(() => Subscription, { name: 'subscription' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Subscription.name)
  public findOne(@Args('id') id: string) {
    return this.subscriptionService.findOne({ id });
  }

  @Mutation(() => Subscription)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Subscription.name)
  public updateSubscription(
    @Args('updateSubscriptionInput')
    updateSubscriptionInput: UpdateSubscriptionInput,
  ) {
    return this.subscriptionService.update(updateSubscriptionInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Subscription.name)
  public removeSubscription(@Args('id') id: string) {
    this.subscriptionService.remove(id);

    return {
      done: true,
    };
  }

  @Mutation(() => CheckAccessOutput)
  @UseGuards(JwtAuthUserGuard)
  public async checkAccess(
    @Args('input')
    input: CheckContentAccessInput,
    @Context() context: GqlContext,
  ) {
    const userId = getUserId(context.req.user);

    return this.subscriptionService.checkAccess(userId, input);
  }
}
