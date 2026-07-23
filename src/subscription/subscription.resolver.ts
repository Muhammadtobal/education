import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { SubscriptionPaginationResultOutput } from './dto/find-all-subscription.output';
import { FindAllSubscriptionInput } from './dto/find-all-subscription.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { UseGuards } from '@nestjs/common';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';

@Resolver(() => Subscription)
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Mutation(() => Subscription)
  @UseGuards(JwtAuthSharedGuard)
  public createSubscription(
    @Args('createSubscriptionInput')
    createSubscriptionInput: CreateSubscriptionInput,
  ) {
    return this.subscriptionService.create(createSubscriptionInput);
  }

  @Query(() => SubscriptionPaginationResultOutput, { name: 'subscriptions' })
  @UseGuards(JwtAuthSharedGuard)
  public findAll(@Args('filter') filter: FindAllSubscriptionInput) {
    return this.subscriptionService.findAll(filter);
  }

  @Query(() => Subscription, { name: 'subscription' })
  public findOne(@Args('id') id: string) {
    return this.subscriptionService.findOne({ id });
  }

  @Mutation(() => Subscription)
  @UseGuards(JwtAuthSharedGuard)
  public updateSubscription(
    @Args('updateSubscriptionInput')
    updateSubscriptionInput: UpdateSubscriptionInput,
  ) {
    return this.subscriptionService.update(updateSubscriptionInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  public removeSubscription(@Args('id') id: string) {
    this.subscriptionService.remove(id);
    return { done: true };
  }
}
