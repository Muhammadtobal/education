import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreatePaymentCodeInput } from './dto/create-payment_code.input';
import { UpdatePaymentCodeInput } from './dto/update-payment_code.input';
import { PaymentCode } from './entities/payment_code.entity';
import { FindAllPaymentCodeInput } from './dto/find-all-payment_code.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { randomBytes, randomInt } from 'crypto';
import { CheckActivationPaymentCodeInput } from './dto/check-payment-code.input';
import { ErrorMessages } from 'src/shared/error-messages.object';
import { PaymentItemType } from 'src/shared/enums/payment_item_type.enum';

@Injectable()
export class PaymentCodeService {
  constructor(
    @InjectRepository(PaymentCode)
    private readonly paymentCodeRepository: Repository<PaymentCode>,
  ) {}
  public async create(createPaymentCodeInput: CreatePaymentCodeInput) {
    const {
      count,
      plan_id,
      content_id,
      course_id,
      expires_at,
      active,
      starts_at,
    } = createPaymentCodeInput;

    const paymentCodes: PaymentCode[] = [];

    for (let i = 0; i < count; i++) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      const randomPart = Array.from({ length: 8 }, () => {
        return chars[randomInt(chars.length)];
      }).join('');

      const code = `${createPaymentCodeInput.prefix.toUpperCase()}${randomPart}`;
      const paymentCode = this.paymentCodeRepository.create({
        code,
        plan_id,
        expires_at,
        starts_at,
        active,
        content_id,
        course_id,
      });

      paymentCodes.push(paymentCode);
    }
    return this.paymentCodeRepository.save(paymentCodes);
  }

  public findAll(filter: FindAllPaymentCodeInput) {
    const query = this.paymentCodeRepository
      .createQueryBuilder('payment_code')
      .where('true');
    generateQuerySorts<PaymentCode>(query, filter, PaymentCode, 'paymentCode');
    generateQueryConditions<PaymentCode>(query, filter, 'paymentCode');

    return customPaginate<PaymentCode, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    paymentCodeOptions: FindOptionsWhere<PaymentCode>,
    options?: {
      selected?: FindOptionsSelect<PaymentCode>;
      relations?: FindOptionsRelations<PaymentCode>;
    },
  ) {
    return this.paymentCodeRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: paymentCodeOptions,
    });
  }

  public async update(updatePaymentCodeInput: UpdatePaymentCodeInput) {
    await this.paymentCodeRepository.update(
      { id: updatePaymentCodeInput.id },
      updatePaymentCodeInput,
    );
    return this.findOne({ id: updatePaymentCodeInput.id });
  }

  public remove(id: string) {
    this.paymentCodeRepository.delete(id);
  }

  public async checkActivationPaymentCode(
    checkActivationPaymentCodeInput: CheckActivationPaymentCodeInput,
  ) {
    const { code, payment_item_type, plan_id, course_id, content_id } =
      checkActivationPaymentCodeInput;

    // =========================
    // Validate required ID حسب type
    // =========================

    switch (payment_item_type) {
      case PaymentItemType.PLAN:
        if (!plan_id) {
          throw new HttpException(
            ErrorMessages.PAYMENT_CODE_PLAN_ID_REQUIRED,
            HttpStatus.BAD_REQUEST,
          );
        }
        break;

      case PaymentItemType.COURSE:
        if (!course_id) {
          throw new HttpException(
            ErrorMessages.PAYMENT_CODE_COURSE_ID_REQUIRED,
            HttpStatus.BAD_REQUEST,
          );
        }
        break;

      case PaymentItemType.CONTENT:
        if (!content_id) {
          throw new HttpException(
            ErrorMessages.PAYMENT_CODE_CONTENT_ID_REQUIRED,
            HttpStatus.BAD_REQUEST,
          );
        }
        break;

      default:
        throw new HttpException(
          ErrorMessages.PAYMENT_CODE_HAS_NO_TARGET,
          HttpStatus.BAD_REQUEST,
        );
    }

    // =========================
    // Find Payment Code
    // =========================

    const loadedCode = await this.paymentCodeRepository.findOne({
      where: {
        code,
      },
    });

    if (!loadedCode) {
      throw new HttpException(
        ErrorMessages.PAYMENT_CODE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!loadedCode.active) {
      throw new HttpException('payment not active', HttpStatus.BAD_REQUEST);
    }
    // =========================
    // Validate Payment Code حسب type
    // =========================

    switch (payment_item_type) {
      case PaymentItemType.PLAN: {
        // لازم الكود يكون مربوط بـ Plan
        if (!loadedCode.plan_id) {
          throw new HttpException(
            ErrorMessages.PAYMENT_CODE_IS_NOT_FOR_THIS_PLAN,
            HttpStatus.BAD_REQUEST,
          );
        }

        if (loadedCode.plan_id !== plan_id) {
          throw new HttpException(
            ErrorMessages.PAYMENT_CODE_IS_NOT_FOR_THIS_PLAN,
            HttpStatus.BAD_REQUEST,
          );
        }

        break;
      }

      case PaymentItemType.COURSE: {
        // لازم الكود يكون مربوط بـ Course
        if (!loadedCode.course_id) {
          throw new HttpException(
            ErrorMessages.PAYMENT_CODE_IS_NOT_FOR_THIS_COURSE,
            HttpStatus.BAD_REQUEST,
          );
        }

        if (loadedCode.course_id !== course_id) {
          throw new HttpException(
            ErrorMessages.PAYMENT_CODE_IS_NOT_FOR_THIS_COURSE,
            HttpStatus.BAD_REQUEST,
          );
        }

        break;
      }

      case PaymentItemType.CONTENT: {
        // لازم الكود يكون مربوط بـ Content
        if (!loadedCode.content_id) {
          throw new HttpException(
            ErrorMessages.PAYMENT_CODE_IS_NOT_FOR_THIS_CONTENT,
            HttpStatus.BAD_REQUEST,
          );
        }

        if (loadedCode.content_id !== content_id) {
          throw new HttpException(
            ErrorMessages.PAYMENT_CODE_IS_NOT_FOR_THIS_CONTENT,
            HttpStatus.BAD_REQUEST,
          );
        }

        break;
      }

      default:
        throw new HttpException(
          ErrorMessages.PAYMENT_CODE_HAS_NO_TARGET,
          HttpStatus.BAD_REQUEST,
        );
    }

    // =========================
    // Date validation
    // =========================

    const formatDateTime = (date: Date) => {
      const d = new Date(date);

      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();

      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const now = new Date();

    // =========================
    // Starts At
    // =========================

    if (loadedCode.starts_at && now < new Date(loadedCode.starts_at)) {
      throw new HttpException(
        ErrorMessages.PAYMENT_CODE_NOT_ACTIVE_YET(
          formatDateTime(loadedCode.starts_at),
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    // =========================
    // Expires At
    // =========================

    if (loadedCode.expires_at && now > new Date(loadedCode.expires_at)) {
      throw new HttpException(
        ErrorMessages.PAYMENT_CODE_EXPIRED(
          formatDateTime(loadedCode.expires_at),
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    // =========================
    // Valid
    // =========================

    return loadedCode;
  }
}
