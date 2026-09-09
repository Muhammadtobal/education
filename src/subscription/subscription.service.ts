import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Content } from 'src/content/entities/content.entity';
import { ErrorMessages } from 'src/shared/error-messages.object';
import { CheckContentAccessInput } from './dto/check-access-content.inputs';
import { PlanCourse } from 'src/plan_course/entities/plan_course.entity';
import { ContentService } from 'src/content/content.service';
import { PlanCourseService } from 'src/plan_course/plan_course.service';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,

    @InjectDataSource()
    private readonly dataSource: DataSource,

    private readonly ContentService: ContentService,
    private readonly planCourseService: PlanCourseService,
    private readonly courseService: CourseService,
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

        let teacherShare = 0;

        if (subscription.course_id) {
          const course = await queryRunner.manager.findOne(Course, {
            where: {
              id: subscription.course_id,
            },
          });

          if (!course) {
            throw new Error('Course not found');
          }

          if (payment.teacher_id) {
            const courseTeacher = await queryRunner.manager.findOne(Course, {
              where: {
                teacher_id: payment.teacher_id,
              },
            });

            teacherShare = Number(courseTeacher?.teacher_share ?? 0);
          }
        } else if (subscription.content_id) {
          const content = await queryRunner.manager.findOne(Content, {
            where: {
              id: subscription.content_id,
            },
            relations: {
              course: true,
            },
          });

          if (!content) {
            throw new Error('Content not found');
          }

          if (payment.teacher_id) {
            const course = await queryRunner.manager.findOne(Course, {
              where: {
                teacher_id: payment.teacher_id,
              },
            });

            teacherShare = Number(course?.teacher_share ?? 0);
          }
        }

        if (payment.teacher_id && teacherShare > 0) {
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
            Number(teacher.balance) - (price * teacherShare) / 100;

          await queryRunner.manager.save(teacher);
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
  private checkSubscriptionValid(subscription: Subscription) {
    if (!subscription.active) {
      throw new HttpException(
        ErrorMessages.SUBSCRIPTION_NOT_ACTIVE,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (subscription.end_date && new Date() > new Date(subscription.end_date)) {
      throw new HttpException(
        ErrorMessages.SUBSCRIPTION_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
    }

    return subscription;
  }

  private isSubscriptionValid(subscription: Subscription): boolean {
    if (!subscription.active) {
      return false;
    }

    if (subscription.end_date && new Date() > new Date(subscription.end_date)) {
      return false;
    }

    return true;
  }

  private async checkCourseAccess(user_id: string, course_id: string) {
    const subscription = await this.findOne({
      user_id,
      course_id,
    });

    if (!subscription) {
      throw new HttpException(
        ErrorMessages.COURSE_ACCESS_DENIED,
        HttpStatus.FORBIDDEN,
      );
    }

    this.checkSubscriptionValid(subscription);

    return {
      allowed: true,
      reason: 'COURSE_SUBSCRIPTION',
      subscription_id: subscription.id,
    };
  }

  private async checkPlanAccess(user_id: string, plan_id: string) {
    const subscription = await this.findOne({
      user_id,
      plan_id,
    });

    if (!subscription) {
      throw new HttpException(
        ErrorMessages.PLAN_ACCESS_DENIED,
        HttpStatus.FORBIDDEN,
      );
    }

    this.checkSubscriptionValid(subscription);

    return {
      allowed: true,
      reason: 'PLAN_SUBSCRIPTION',
      subscription_id: subscription.id,
    };
  }

  public async checkContentAccess(user_id: string, content_id: string) {
    const content = await this.ContentService.findOne({
      id: content_id,
    });

    if (!content) {
      throw new HttpException(
        ErrorMessages.CONTENT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (content.is_free) {
      return {
        allowed: true,
        reason: 'FREE_CONTENT',
      };
    }

    const contentSubscription = await this.findOne({
      user_id,
      content_id,
    });

    if (contentSubscription) {
      if (this.isSubscriptionValid(contentSubscription)) {
        return {
          allowed: true,
          reason: 'CONTENT_SUBSCRIPTION',
          subscription_id: contentSubscription.id,
        };
      }
    }

    if (content.course_id) {
      const courseSubscription = await this.findOne({
        user_id,
        course_id: content.course_id,
      });

      const course = await this.courseService.findOne({
        id: content.course_id,
      });

      if (course && course.active === false) {
        throw new HttpException(
          ErrorMessages.COURSE_NOT_ACTIVE,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (courseSubscription) {
        if (this.isSubscriptionValid(courseSubscription)) {
          return {
            allowed: true,
            reason: 'COURSE_SUBSCRIPTION',
            subscription_id: courseSubscription.id,
          };
        }
      }
    }

    const planCourseRepository = this.dataSource.getRepository(PlanCourse);

    const planCourses = await planCourseRepository.find({
      where: [
        ...(content.course_id
          ? [
              {
                course_id: content.course_id,
                active: true,
              },
            ]
          : []),
        {
          content_id: content.id,
          active: true,
        },
      ],
    });

    for (const planCourse of planCourses) {
      if (!planCourse.plan_id) {
        continue;
      }

      const planSubscription = await this.findOne({
        user_id,
        plan_id: planCourse.plan_id,
      });

      if (planSubscription) {
        // إذا صالح → Allow
        if (this.isSubscriptionValid(planSubscription)) {
          return {
            allowed: true,
            reason: 'PLAN_SUBSCRIPTION',
            subscription_id: planSubscription.id,
          };
        }
      }
    }

    throw new HttpException(
      ErrorMessages.CONTENT_ACCESS_DENIED,
      HttpStatus.FORBIDDEN,
    );
  }

  public async checkAccess(user_id: string, input: CheckContentAccessInput) {
    const { content_id, course_id, plan_id } = input;

    const targets = [content_id, course_id, plan_id].filter(Boolean);

    if (targets.length !== 1) {
      throw new HttpException(
        ErrorMessages.PROVIDE_EXACTLY_ONE_TARGET,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (content_id) {
      return this.checkContentAccess(user_id, content_id);
    }

    if (course_id) {
      return this.checkCourseAccess(user_id, course_id);
    }

    if (plan_id) {
      return this.checkPlanAccess(user_id, plan_id);
    }

    throw new HttpException(
      ErrorMessages.PROVIDE_EXACTLY_ONE_TARGET,
      HttpStatus.BAD_REQUEST,
    );
  }
}
