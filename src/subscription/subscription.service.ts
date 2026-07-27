import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
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
import { Payment } from 'src/payment/entities/payment.entity';
import { Course } from 'src/course/entities/course.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { CourseTeacher } from 'src/course/entities/course_teacher.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
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
    const subscription = await this.findOne({
      id: updateSubscriptionInput.id,
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (
      subscription.active === true &&
      updateSubscriptionInput.active === false
    ) {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const payment = await queryRunner.manager.findOne(Payment, {
          where: {
            subscription_id: subscription.id,
            active: true,
          },
        });

        if (!payment) {
          throw new Error('Payment not found');
        }

        const price = Math.abs(Number(payment.value));

        if (subscription.course_id) {
          const course = await queryRunner.manager.findOne(Course, {
            where: {
              id: subscription.course_id,
            },
          });

          if (!course) {
            throw new Error('Course not found');
          }

          if (course.vendor_share && Number(course.vendor_share) > 0) {
            const vendor = await queryRunner.manager.findOne(Vendor, {
              where: {
                id: course.vendor_id,
              },
              lock: {
                mode: 'pessimistic_write',
              },
            });

            if (!vendor) {
              throw new Error('Vendor not found');
            }

            vendor.balance =
              Number(vendor.balance) -
              (price * Number(course.vendor_share)) / 100;

            await queryRunner.manager.save(vendor);
          }

          if (payment.teacher_id) {
            const courseTeacher = await queryRunner.manager.findOne(
              CourseTeacher,
              {
                where: {
                  course_id: course.id,
                  teacher_id: payment.teacher_id,
                },
              },
            );

            if (courseTeacher && Number(courseTeacher.teacher_share) > 0) {
              const teacher = await queryRunner.manager.findOne(Teacher, {
                where: {
                  id: payment.teacher_id,
                },
                lock: {
                  mode: 'pessimistic_write',
                },
              });

              if (!teacher) {
                throw new Error('Teacher not found');
              }

              teacher.balance =
                Number(teacher.balance) -
                (price * Number(courseTeacher.teacher_share)) / 100;

              await queryRunner.manager.save(teacher);
            }
          }
        }

        payment.value = -price;

        await queryRunner.manager.save(payment);

        await queryRunner.manager.update(
          Subscription,
          {
            id: subscription.id,
          },
          updateSubscriptionInput,
        );

        await queryRunner.commitTransaction();

        return this.findOne({
          id: subscription.id,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    await this.subscriptionRepository.update(
      { id: updateSubscriptionInput.id },
      updateSubscriptionInput,
    );

    return this.findOne({
      id: updateSubscriptionInput.id,
    });
  }

  public remove(id: string) {
    this.subscriptionRepository.delete(id);
  }
}
