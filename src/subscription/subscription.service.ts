import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { Subscription } from './entities/subscription.entity';
import { FindAllSubscriptionInput } from './dto/find-all-subscription.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}
  public create(createSubscriptionInput: CreateSubscriptionInput) {
    const subscription = this.subscriptionRepository.create(
      createSubscriptionInput,
    );
    return this.subscriptionRepository.save(subscription);
  }

  public findAll(filter: FindAllSubscriptionInput) {
    const query = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.user', 'user')
      .leftJoinAndSelect('subscription.course', 'course')
      .where('true');
    generateQuerySorts<Subscription>(
      query,
      filter,
      Subscription,
      'subscription',
    );
    generateQueryConditions<Subscription>(query, filter, 'subscription');

    return customPaginate<Subscription, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    subscriptionOptions: FindOptionsWhere<Subscription>,
    options?: {
      selected?: FindOptionsSelect<Subscription>;
      relations?: FindOptionsRelations<Subscription>;
    },
  ) {
    return this.subscriptionRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: subscriptionOptions,
    });
  }

  public async update(updateSubscriptionInput: UpdateSubscriptionInput) {
    await this.subscriptionRepository.update(
      { id: updateSubscriptionInput.id },
      updateSubscriptionInput,
    );
    return this.findOne({ id: updateSubscriptionInput.id });
  }

  public remove(id: string) {
    this.subscriptionRepository.delete(id);
  }
}
