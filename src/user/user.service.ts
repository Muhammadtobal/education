import { Injectable } from "@nestjs/common";
import { paginate } from "nestjs-typeorm-paginate";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindOperator,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm";

import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./entities/user.entity";
import { FindAllUserInput } from "./dto/find-all-user.input";
import {
  customPaginate,
  generateQueryConditions,
  generateQuerySorts,
  metaTransformer,
} from "src/shared/helpers";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import { ActivationCode } from "./entities/activation_code.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(ActivationCode)
    private readonly activationCodeRepository: Repository<ActivationCode>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  public create(createUserInput: CreateUserInput) {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  public findAll(filter: FindAllUserInput) {
    const query = this.userRepository.createQueryBuilder("user");
    if (filter.select && filter.select?.length) {
      const fields = filter.select.includes("id")
        ? filter.select
        : ["id", ...filter.select];

      query.select(fields.map((field) => `user.${field}`));
    } else {
      query.select("user");
      query.leftJoinAndSelect("user.city", "city");
    }
    query.where("true");

    generateQuerySorts<User>(query, filter, User, "user");

    generateQueryConditions<User>(query, filter, "user");

    return customPaginate<User, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    userOptions: FindOptionsWhere<User>,
    options?: {
      selected?: FindOptionsSelect<User>;
      relations?: FindOptionsRelations<User>;
    },
  ) {
    return this.userRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: userOptions,
    });
  }

  public async update(updateUserInput: UpdateUserInput) {
    await this.userRepository.update(
      { id: updateUserInput.id },
      updateUserInput,
    );

    return this.findOne(
      { id: updateUserInput.id },
      {
        relations: {
          city: true,
        },
      },
    );
  }

  public findOneActivationCode(
    activationCodeOptions: FindOptionsWhere<ActivationCode>,
    options?: {
      selected?: FindOptionsSelect<ActivationCode>;
      relations?: FindOptionsRelations<ActivationCode>;
    },
  ) {
    return this.activationCodeRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: activationCodeOptions,
    });
  }

  public async removeActivationCode(id: string) {
    await this.activationCodeRepository.delete({ id });
  }

  public async updateActivationCode(
    updateActivationCodeInput: Partial<ActivationCode>,
  ) {
    await this.activationCodeRepository.update(
      { id: updateActivationCodeInput.id },
      updateActivationCodeInput,
    );
    return this.findOne({ id: updateActivationCodeInput.id });
  }

  public createActivationCode(
    activationCode: Omit<ActivationCode, "id" | "expires_at" | "setExpiration">,
  ) {
    const code = this.activationCodeRepository.create(activationCode);
    return this.activationCodeRepository.save(code);
  }

  public count(userFilter: FindOptionsWhere<User>) {
    return this.userRepository.count({
      where: userFilter,
    });
  }
}
