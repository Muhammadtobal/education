import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
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
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}
  public create(createPaymentInput: CreatePaymentInput) {
    const payment = this.paymentRepository.create(createPaymentInput);
    return this.paymentRepository.save(payment);
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
