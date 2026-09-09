import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { PlanType } from 'src/shared/enums/plan_type.enum';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Content } from 'src/content/entities/content.entity';
import { UserCoupon } from 'src/coupon/entities/user_coupon.entity';
import { DiscountType } from 'src/shared/enums/discount_type.enum';
import { CouponService } from 'src/coupon/coupon.service';
import { PaymentItemType } from 'src/shared/enums/payment_item_type.enum';
import { Plan } from 'src/plan/entities/plan.entity';
import { PaymentCodeService } from 'src/payment_code/payment_code.service';
import { PaymentCode } from 'src/payment_code/entities/payment_code.entity';
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly couponService: CouponService,
    private readonly paymentCodeService: PaymentCodeService,
  ) {}
  public async create(createPaymentInput: CreatePaymentInput) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let loadedPaymentCode: PaymentCode | null = null;

      switch (createPaymentInput.payment_item_type) {
        case PaymentItemType.PLAN: {
          if (!createPaymentInput.plan_id) {
            throw new HttpException(
              'Plan ID is required',
              HttpStatus.BAD_REQUEST,
            );
          }

          break;
        }

        case PaymentItemType.COURSE: {
          if (!createPaymentInput.course_id) {
            throw new HttpException(
              'course ID is required',
              HttpStatus.BAD_REQUEST,
            );
          }

          break;
        }

        case PaymentItemType.CONTENT: {
          if (!createPaymentInput.content_id) {
            throw new HttpException(
              'Content ID is required',
              HttpStatus.BAD_REQUEST,
            );
          }

          break;
        }

        default: {
          throw new HttpException(
            'Invalid payment item type',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      let plan: Plan | null = null;
      let course: Course | null = null;
      let content: Content | null = null;

      let price = 0;
      let countDay = 0;

      switch (createPaymentInput.payment_item_type) {
        case PaymentItemType.PLAN: {
          plan = await queryRunner.manager.findOne(Plan, {
            where: {
              id: createPaymentInput.plan_id,
            },
          });

          if (!plan) {
            throw new HttpException('Plan not found', HttpStatus.BAD_REQUEST);
          }

          price = Number(plan.price);
          countDay = Number(plan.count_days);

          break;
        }

        case PaymentItemType.COURSE: {
          course = await queryRunner.manager.findOne(Course, {
            where: {
              id: createPaymentInput.course_id,
            },
          });

          if (!course) {
            throw new HttpException('Course not found', HttpStatus.BAD_REQUEST);
          }

          price = Number(course.price);
          countDay = Number(course.count_days);

          break;
        }

        case PaymentItemType.CONTENT: {
          content = await queryRunner.manager.findOne(Content, {
            where: {
              id: createPaymentInput.content_id,
            },
          });

          if (!content) {
            throw new HttpException(
              'Content not found',
              HttpStatus.BAD_REQUEST,
            );
          }

          price = Number(content.price);
          countDay = Number(content.count_days);

          break;
        }
      }

      if (!Number.isFinite(price) || price < 0) {
        throw new HttpException('Invalid price', HttpStatus.BAD_REQUEST);
      }

      if (!Number.isInteger(countDay) || countDay < 0) {
        throw new HttpException('Invalid count day', HttpStatus.BAD_REQUEST);
      }

      if (createPaymentInput.payment_code) {
        loadedPaymentCode =
          await this.paymentCodeService.checkActivationPaymentCode({
            code: createPaymentInput.payment_code,

            payment_item_type: createPaymentInput.payment_item_type,

            plan_id: createPaymentInput.plan_id,

            course_id: createPaymentInput.course_id,

            content_id: createPaymentInput.content_id,
          });
      }

      if (createPaymentInput.code) {
        const coupon = await this.couponService.checkActivationCoupon(
          {
            code: createPaymentInput.code,

            type: createPaymentInput.payment_item_type,

            plan_id: createPaymentInput.plan_id,

            course_id: createPaymentInput.course_id,

            content_id: createPaymentInput.content_id,
          },

          createPaymentInput.user_id,
        );

        if (price < Number(coupon.min_order_amount)) {
          throw new HttpException(
            `Minimum amount is ${coupon.min_order_amount}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        let couponDiscount = 0;

        if (coupon.discount_type === DiscountType.PERCENTAGE) {
          couponDiscount = price * (Number(coupon.discount_value) / 100);

          if (
            coupon.max_discount !== null &&
            coupon.max_discount !== undefined &&
            couponDiscount > Number(coupon.max_discount)
          ) {
            couponDiscount = Number(coupon.max_discount);
          }
        } else {
          couponDiscount = Number(coupon.discount_value);
        }

        price -= couponDiscount;

        if (price < 0) {
          price = 0;
        }

        coupon.used_count += 1;

        await queryRunner.manager.save(coupon);

        const userCoupon = queryRunner.manager.create(UserCoupon, {
          coupon_id: coupon.id,
          user_id: createPaymentInput.user_id,
        });

        await queryRunner.manager.save(userCoupon);
      }

      const startDate = new Date();

      const endDate = new Date(startDate);

      endDate.setDate(endDate.getDate() + countDay);

      let subscription: Subscription | null = null;

      if (createPaymentInput.payment_item_type !== PaymentItemType.PLAN) {
        subscription = queryRunner.manager.create(Subscription, {
          user_id: createPaymentInput.user_id,

          plan_id: undefined,

          course_id:
            createPaymentInput.payment_item_type === PaymentItemType.COURSE
              ? createPaymentInput.course_id
              : undefined,

          content_id:
            createPaymentInput.payment_item_type === PaymentItemType.CONTENT
              ? createPaymentInput.content_id
              : undefined,

          end_date: endDate,

          active: true,
        });

        await queryRunner.manager.save(subscription);
      }

      if (createPaymentInput.payment_item_type === PaymentItemType.COURSE) {
        if (!course?.teacher_id) {
          throw new HttpException(
            'Course teacher not found',
            HttpStatus.BAD_REQUEST,
          );
        }

        const teacherId = course.teacher_id;

        const teacherShare = Number(course.teacher_share ?? 0);

        if (
          !Number.isFinite(teacherShare) ||
          teacherShare < 0 ||
          teacherShare > 100
        ) {
          throw new HttpException(
            'Invalid teacher share',
            HttpStatus.BAD_REQUEST,
          );
        }

        const teacherAmount = (price * teacherShare) / 100;

        const teacher = await queryRunner.manager.findOne(Teacher, {
          where: {
            id: teacherId,
          },

          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!teacher) {
          throw new HttpException('Teacher not found', HttpStatus.BAD_REQUEST);
        }

        const payment = queryRunner.manager.create(Payment, {
          subscription_id: subscription!.id,

          teacher_id: teacherId,

          value: Number(course!.price),

          active: true,
        });
        await queryRunner.manager.save(payment);

        teacher.balance =
          Number(teacher.balance ?? 0) + Number(teacherAmount.toFixed(2));

        await queryRunner.manager.save(teacher);
        if (loadedPaymentCode) {
          loadedPaymentCode.active = false;
          await queryRunner.manager.save(loadedPaymentCode);
        }
        await queryRunner.commitTransaction();

        return { payment };
      }

      if (createPaymentInput.payment_item_type === PaymentItemType.CONTENT) {
        if (!content?.course_id) {
          throw new HttpException(
            'Content course is required',
            HttpStatus.BAD_REQUEST,
          );
        }

        // ----------------------------------------------
        // Load parent Course
        // ----------------------------------------------

        const contentCourse = await queryRunner.manager.findOne(Course, {
          where: {
            id: content.course_id,
          },
        });

        if (!contentCourse) {
          throw new HttpException('Course not found', HttpStatus.BAD_REQUEST);
        }

        if (!contentCourse.teacher_id) {
          throw new HttpException(
            'Course teacher not found',
            HttpStatus.BAD_REQUEST,
          );
        }

        const teacherId = contentCourse.teacher_id;

        const teacherShare = Number(contentCourse.teacher_share ?? 0);

        if (
          !Number.isFinite(teacherShare) ||
          teacherShare < 0 ||
          teacherShare > 100
        ) {
          throw new HttpException(
            'Invalid teacher share',
            HttpStatus.BAD_REQUEST,
          );
        }

        const teacherAmount = (price * teacherShare) / 100;

        const teacher = await queryRunner.manager.findOne(Teacher, {
          where: {
            id: teacherId,
          },

          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!teacher) {
          throw new HttpException('Teacher not found', HttpStatus.BAD_REQUEST);
        }

        const payment = queryRunner.manager.create(Payment, {
          subscription_id: subscription!.id,

          teacher_id: teacherId,

          value: Number(content!.price),

          active: true,
        });

        await queryRunner.manager.save(payment);

        teacher.balance =
          Number(teacher.balance ?? 0) + Number(teacherAmount.toFixed(2));

        await queryRunner.manager.save(teacher);
        if (loadedPaymentCode) {
          loadedPaymentCode.active = false;
          await queryRunner.manager.save(loadedPaymentCode);
        }
        await queryRunner.commitTransaction();

        return { payment };
      }

      if (createPaymentInput.payment_item_type === PaymentItemType.PLAN) {
        const planCourses = await queryRunner.manager.find(PlanCourse, {
          where: {
            plan_id: plan!.id,
            active: true,
          },
        });

        if (!planCourses.length) {
          throw new HttpException(
            'Plan has no courses or contents',
            HttpStatus.BAD_REQUEST,
          );
        }

        const payments: Payment[] = [];

        for (const planCourse of planCourses) {
          let teacherId: string | undefined;
          let teacherShare = 0;

          if (planCourse.course_id) {
            const planCourseEntity = await queryRunner.manager.findOne(Course, {
              where: {
                id: planCourse.course_id,
              },
            });

            if (!planCourseEntity) {
              throw new HttpException(
                'Course not found',
                HttpStatus.BAD_REQUEST,
              );
            }

            if (!planCourseEntity.teacher_id) {
              throw new HttpException(
                'Course teacher not found',
                HttpStatus.BAD_REQUEST,
              );
            }

            teacherId = planCourseEntity.teacher_id;
            teacherShare = Number(planCourseEntity.teacher_share ?? 0);
          }

          if (planCourse.content_id) {
            const planContent = await queryRunner.manager.findOne(Content, {
              where: {
                id: planCourse.content_id,
              },
            });

            if (!planContent) {
              throw new HttpException(
                'Content not found',
                HttpStatus.BAD_REQUEST,
              );
            }

            if (!planContent.course_id) {
              throw new HttpException(
                'Content course is required',
                HttpStatus.BAD_REQUEST,
              );
            }

            const contentCourse = await queryRunner.manager.findOne(Course, {
              where: {
                id: planContent.course_id,
              },
            });

            if (!contentCourse) {
              throw new HttpException(
                'Course not found',
                HttpStatus.BAD_REQUEST,
              );
            }

            if (!contentCourse.teacher_id) {
              throw new HttpException(
                'Course teacher not found',
                HttpStatus.BAD_REQUEST,
              );
            }

            teacherId = contentCourse.teacher_id;
            teacherShare = Number(contentCourse.teacher_share ?? 0);
          }

          if (
            !Number.isFinite(teacherShare) ||
            teacherShare < 0 ||
            teacherShare > 100
          ) {
            throw new HttpException(
              'Invalid teacher share',
              HttpStatus.BAD_REQUEST,
            );
          }

          if (!teacherId) {
            throw new HttpException(
              'Teacher not found',
              HttpStatus.BAD_REQUEST,
            );
          }

          const itemPrice = Number(planCourse.price_after_discount ?? 0);

          if (!Number.isFinite(itemPrice) || itemPrice < 0) {
            throw new HttpException(
              'Invalid PlanCourse price',
              HttpStatus.BAD_REQUEST,
            );
          }

          const planSubscription = queryRunner.manager.create(Subscription, {
            user_id: createPaymentInput.user_id,

            plan_id: createPaymentInput.plan_id,

            course_id: planCourse.course_id ?? undefined,

            content_id: planCourse.content_id ?? undefined,

            end_date: endDate,

            active: true,
          });

          const savedSubscription =
            await queryRunner.manager.save(planSubscription);

          const teacherAmount = (itemPrice * teacherShare) / 100;

          if (teacherAmount <= 0) {
            continue;
          }

          const teacher = await queryRunner.manager.findOne(Teacher, {
            where: {
              id: teacherId,
            },
            lock: {
              mode: 'pessimistic_write',
            },
          });

          if (!teacher) {
            throw new HttpException(
              'Teacher not found',
              HttpStatus.BAD_REQUEST,
            );
          }

          const finalTeacherAmount = Number(teacherAmount.toFixed(2));

          const payment = queryRunner.manager.create(Payment, {
            subscription_id: savedSubscription.id,

            teacher_id: teacherId,

            value: Number(itemPrice.toFixed(2)),

            active: true,
          });

          await queryRunner.manager.save(payment);

          payments.push(payment);

          teacher.balance = Number(teacher.balance ?? 0) + finalTeacherAmount;

          await queryRunner.manager.save(teacher);
        }

        await queryRunner.manager.save([]);

        if (loadedPaymentCode) {
          loadedPaymentCode.active = false;
          await queryRunner.manager.save(loadedPaymentCode);
        }
        await queryRunner.commitTransaction();

        return { payments };
      }
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
      .leftJoinAndSelect('payment.course', 'course')
      .leftJoinAndSelect('payment.teacher', 'teacher')
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
