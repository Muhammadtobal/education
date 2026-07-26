import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  DataSource,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { Payment } from './entities/payment.entity';
import { FindAllPaymentInput } from './dto/find-all-payment.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
  PaymentValidationError,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { PlanCourse } from 'src/plan_course/entities/plan_course.entity';
import { Course } from 'src/course/entities/course.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { CourseTeacher } from 'src/course/entities/course_teacher.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { PlanType } from 'src/shared/enums/plan_type.enum';
import { Subscription } from 'src/subscription/entities/subscription.entity';
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  public async create(createPaymentInput: CreatePaymentInput) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let planCourse: PlanCourse | null = null;

      if (createPaymentInput.course_id) {
        planCourse = await queryRunner.manager.findOne(PlanCourse, {
          where: {
            plan_id: createPaymentInput.plan_id,
            course_id: createPaymentInput.course_id,
          },
          relations: {
            plan: true,
          },
        });
      } else if (createPaymentInput.content_id) {
        planCourse = await queryRunner.manager.findOne(PlanCourse, {
          where: {
            plan_id: createPaymentInput.plan_id,
            content_id: createPaymentInput.content_id,
          },
          relations: {
            plan: true,
          },
        });
      }

      if (!planCourse) {
        throw new PaymentValidationError(
          'Plan course not found',
          'PLAN_COURSE_NOT_FOUND',
        );
      }

      const plan = planCourse.plan;

      if (!plan) {
        throw new PaymentValidationError('Plan not found', 'PLAN_NOT_FOUND');
      }

      const price = Number(plan.price);

      let endDate: Date | null = null;

      switch (plan.plan_type) {
        case PlanType.DAILY:
          if (!plan.days) {
            throw new PaymentValidationError(
              'Daily plan days is required',
              'DAILY_PLAN_DAYS_REQUIRED',
            );
          }

          endDate = new Date();
          endDate.setDate(endDate.getDate() + Number(plan.days));

          break;

        case PlanType.SEASONAL:
          if (!plan.end_date) {
            throw new PaymentValidationError(
              'Seasonal plan end date is required',
              'SEASONAL_END_DATE_REQUIRED',
            );
          }

          endDate = new Date(plan.end_date);

          break;

        case PlanType.FREE:
          endDate = null;

          break;

        default:
          throw new PaymentValidationError(
            'Invalid plan type',
            'INVALID_PLAN_TYPE',
          );
      }

      const subscription = new Subscription();

      subscription.user_id = createPaymentInput.user_id;
      subscription.course_id = planCourse.course_id ?? undefined;
      subscription.content_id = planCourse.content_id ?? undefined;
      subscription.end_date = endDate ?? undefined;
      subscription.active = true;

      await queryRunner.manager.save(subscription);

      const payment = queryRunner.manager.create(Payment, {
        subscription_id: subscription.id,
        vendor_id: createPaymentInput.vendor_id,
        value: price,
        active: true,
      });

      await queryRunner.manager.save(payment);

      if (planCourse.course_id) {
        const course = await queryRunner.manager.findOne(Course, {
          where: {
            id: planCourse.course_id,
          },
        });

        if (!course) {
          throw new PaymentValidationError(
            'Course not found',
            'COURSE_NOT_FOUND',
          );
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
            throw new PaymentValidationError(
              'Vendor not found',
              'VENDOR_NOT_FOUND',
            );
          }

          vendor.balance =
            Number(vendor.balance) +
            (price * Number(course.vendor_share)) / 100;

          await queryRunner.manager.save(vendor);
        }

        if (createPaymentInput.teacher_id) {
          const courseTeacher = await queryRunner.manager.findOne(
            CourseTeacher,
            {
              where: {
                course_id: course.id,
                teacher_id: createPaymentInput.teacher_id,
              },
            },
          );

          if (
            courseTeacher &&
            courseTeacher.teacher_share &&
            Number(courseTeacher.teacher_share) > 0
          ) {
            const teacher = await queryRunner.manager.findOne(Teacher, {
              where: {
                id: createPaymentInput.teacher_id,
              },
              lock: {
                mode: 'pessimistic_write',
              },
            });

            if (!teacher) {
              throw new PaymentValidationError(
                'Teacher not found',
                'TEACHER_NOT_FOUND',
              );
            }

            teacher.balance =
              Number(teacher.balance) +
              (price * Number(courseTeacher.teacher_share)) / 100;

            await queryRunner.manager.save(teacher);
          }
        }
      }

      await queryRunner.commitTransaction();

      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public findAll(filter: FindAllPaymentInput) {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('payment.vendor', 'vendor')
      .leftJoinAndSelect('payment.course', 'course')
      .where('true');
    generateQuerySorts<Payment>(query, filter, Payment, 'payment');
    generateQueryConditions<Payment>(query, filter, 'payment');

    return customPaginate<Payment, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    paymentOptions: FindOptionsWhere<Payment>,
    options?: {
      selected?: FindOptionsSelect<Payment>;
      relations?: FindOptionsRelations<Payment>;
    },
  ) {
    return this.paymentRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: paymentOptions,
    });
  }

  public async update(updatePaymentInput: UpdatePaymentInput) {
    await this.paymentRepository.update(
      { id: updatePaymentInput.id },
      updatePaymentInput,
    );
    return this.findOne({ id: updatePaymentInput.id });
  }

  public remove(id: string) {
    this.paymentRepository.delete(id);
  }
}
