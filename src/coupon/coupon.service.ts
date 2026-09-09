import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  DataSource,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateCouponInput } from './dto/create-coupon.input';
import { UpdateCouponInput } from './dto/update-coupon.input';
import { Coupon } from './entities/coupon.entity';
import { FindAllCouponInput } from './dto/find-all-coupon.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { CreateUserCouponInput } from './dto/create-user_coupon.input';
import { UserCoupon } from './entities/user_coupon.entity';
import { CheckActivationCouponInput } from './dto/check-activation-coupon.input';
import { ErrorMessages } from 'src/shared/error-messages.object';
import { PlanCouponService } from 'src/plan_coupon/plan_coupon.service';
import { PaymentItemType } from 'src/shared/enums/payment_item_type.enum';
import { PlanCoupon } from 'src/plan_coupon/entities/plan_coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,

    @InjectRepository(UserCoupon)
    private readonly userCouponRepository: Repository<UserCoupon>,
    private readonly planCouponService: PlanCouponService,
    private readonly dataSource: DataSource,
  ) {}
  public create(createCouponInput: CreateCouponInput) {
    const coupon = this.couponRepository.create(createCouponInput);
    return this.couponRepository.save(coupon);
  }

  public findAll(filter: FindAllCouponInput) {
    const query = this.couponRepository
      .createQueryBuilder('coupon')
      .where('true');
    generateQuerySorts<Coupon>(query, filter, Coupon, 'coupon');
    generateQueryConditions<Coupon>(query, filter, 'coupon');

    return customPaginate<Coupon, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    couponOptions: FindOptionsWhere<Coupon>,
    options?: {
      selected?: FindOptionsSelect<Coupon>;
      relations?: FindOptionsRelations<Coupon>;
    },
  ) {
    return this.couponRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: couponOptions,
    });
  }

  public async update(updateCouponInput: UpdateCouponInput) {
    await this.couponRepository.update(
      { id: updateCouponInput.id },
      updateCouponInput,
    );
    return this.findOne({ id: updateCouponInput.id });
  }

  public remove(id: string) {
    this.couponRepository.delete(id);
  }

  public createUserCoupon(createUserCoupon: CreateUserCouponInput) {
    const userCoupon = this.userCouponRepository.create(createUserCoupon);
    return this.couponRepository.save(userCoupon);
  }

  public findOneUserCoupon(
    userCouponOptions: FindOptionsWhere<UserCoupon>,
    options?: {
      selected?: FindOptionsSelect<UserCoupon>;
      relations?: FindOptionsRelations<UserCoupon>;
    },
  ) {
    return this.userCouponRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: userCouponOptions,
    });
  }

  public async checkActivationCoupon(
    checkActivationCouponInput: CheckActivationCouponInput,
    userId: string,
  ) {
    switch (checkActivationCouponInput.type) {
      case PaymentItemType.PLAN: {
        if (!checkActivationCouponInput.plan_id) {
          throw new HttpException(
            'plan_id is required for PLAN coupon',
            HttpStatus.BAD_REQUEST,
          );
        }

        break;
      }

      case PaymentItemType.COURSE: {
        if (!checkActivationCouponInput.course_id) {
          throw new HttpException(
            'course_id is required for COURSE coupon',
            HttpStatus.BAD_REQUEST,
          );
        }

        break;
      }

      case PaymentItemType.CONTENT: {
        if (!checkActivationCouponInput.content_id) {
          throw new HttpException(
            'content_id is required for CONTENT coupon',
            HttpStatus.BAD_REQUEST,
          );
        }

        break;
      }

      default:
        throw new HttpException('Invalid coupon type', HttpStatus.BAD_REQUEST);
    }
    const loadedCoupon = await this.findOne({
      code: checkActivationCouponInput.code,
      active: true,
    });

    if (!loadedCoupon) {
      throw new HttpException(
        ErrorMessages.COUPON_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    let planCoupon: PlanCoupon | null = null;

    switch (checkActivationCouponInput.type) {
      case PaymentItemType.PLAN: {
        planCoupon = await this.planCouponService.findOne({
          coupon_id: loadedCoupon.id,
          plan_id: checkActivationCouponInput.plan_id,
          active: true,
        });

        break;
      }

      case PaymentItemType.COURSE: {
        planCoupon = await this.planCouponService.findOne({
          coupon_id: loadedCoupon.id,
          course_id: checkActivationCouponInput.course_id,
          active: true,
        });

        break;
      }

      case PaymentItemType.CONTENT: {
        planCoupon = await this.planCouponService.findOne({
          coupon_id: loadedCoupon.id,
          content_id: checkActivationCouponInput.content_id,
          active: true,
        });

        break;
      }

      default:
        throw new HttpException(
          ErrorMessages.CONTENT_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
    }

    if (!planCoupon) {
      throw new HttpException(
        ErrorMessages.COUPON_NOT_ALLOWED_FOR_THIS_PLAN,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existing = await this.findOneUserCoupon({
      coupon_id: loadedCoupon.id,
      user_id: userId,
    });

    if (existing) {
      throw new HttpException(
        ErrorMessages.COUPON_ALREADY_USED,
        HttpStatus.BAD_REQUEST,
      );
    }

    const now = new Date();

    if (loadedCoupon.starts_at && now < new Date(loadedCoupon.starts_at)) {
      throw new HttpException(
        ErrorMessages.COUPON_NOT_ACTIVE_YET(
          loadedCoupon.starts_at.toISOString(),
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (loadedCoupon.expires_at && now > new Date(loadedCoupon.expires_at)) {
      throw new HttpException(
        ErrorMessages.COUPON_EXPIRED(loadedCoupon.expires_at.toISOString()),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      loadedCoupon.usage_limit !== undefined &&
      loadedCoupon.usage_limit !== null &&
      loadedCoupon.used_count >= loadedCoupon.usage_limit
    ) {
      throw new HttpException(
        ErrorMessages.COUPON_USAGE_LIMIT_REACHED,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (loadedCoupon.user_id) {
      if (userId !== loadedCoupon.user_id) {
        throw new HttpException(
          ErrorMessages.YOU_ARE_NOT_ALLOWED_TO_USE_THIS_COUPON,
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      if (!userId) {
        throw new HttpException(
          'User ID is required for multi-use coupon',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return loadedCoupon;
  }
}
