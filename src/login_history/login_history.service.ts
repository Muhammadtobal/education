import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateLoginHistoryInput } from './dto/create-login_history.input';
import { UpdateLoginHistoryInput } from './dto/update-login_history.input';
import { LoginHistory } from './entities/login_history.entity';
import { FindAllLoginHistoryInput } from './dto/find-all-login_history.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { ConstantService } from 'src/constant/constant.service';

@Injectable()
export class LoginHistoryService {
  constructor(
    private readonly constantService: ConstantService,

    @InjectRepository(LoginHistory)
    private readonly loginHistoryRepository: Repository<LoginHistory>,
  ) {}
  public create(createLoginHistoryInput: CreateLoginHistoryInput) {
    const loginHistory = this.loginHistoryRepository.create(
      createLoginHistoryInput,
    );
    return this.loginHistoryRepository.save(loginHistory);
  }

  public findAll(filter: FindAllLoginHistoryInput) {
    const query = this.loginHistoryRepository
      .createQueryBuilder('login_history')
      .where('true');
    generateQuerySorts<LoginHistory>(
      query,
      filter,
      LoginHistory,
      'login_history',
    );
    generateQueryConditions<LoginHistory>(query, filter, 'login_history');

    return customPaginate<LoginHistory, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    loginHistoryOptions: FindOptionsWhere<LoginHistory>,
    options?: {
      selected?: FindOptionsSelect<LoginHistory>;
      relations?: FindOptionsRelations<LoginHistory>;
    },
  ) {
    return this.loginHistoryRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: loginHistoryOptions,
    });
  }

  public async update(updateLoginHistoryInput: UpdateLoginHistoryInput) {
    await this.loginHistoryRepository.update(
      { id: updateLoginHistoryInput.id },
      updateLoginHistoryInput,
    );
    return this.findOne({ id: updateLoginHistoryInput.id });
  }

  public remove(id: string) {
    this.loginHistoryRepository.delete(id);
  }

  public async hasFrequentDeviceChanges(
    userId: string,
    currentDeviceKey: string,
  ): Promise<boolean> {
    const maxDevicesConfig = await this.constantService.getValue(
      'MAX_DEVICE_CHANGES_COUNT',
    );

    const periodConfig = await this.constantService.getValue(
      'DEVICE_CHANGE_PERIOD_DAYS',
    );

    const maxDevices = Number(maxDevicesConfig?.count ?? 3);

    const periodDays = Number(periodConfig?.days ?? 2);

    const logins = await this.loginHistoryRepository.find({
      where: {
        user_id: userId,
      },
      order: {
        created_at: 'DESC',
      },
      take: maxDevices,
    });

    if (logins.length < 2) {
      return false;
    }

    const newest = Date.now();

    const oldest = new Date(logins[logins.length - 1].created_at).getTime();

    const diffDays = (newest - oldest) / (1000 * 60 * 60 * 24);

    if (diffDays > periodDays) {
      return false;
    }

    const devices = new Set([
      currentDeviceKey,
      ...logins.map((x) => x.device_key),
    ]);

    return devices.size >= maxDevices;
  }
}
