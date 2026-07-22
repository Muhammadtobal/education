import { Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import {
  customPaginate,
  generateQueryConditions,
  generateQuerySorts,
  metaTransformer,
} from "src/shared/helpers";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import { CreateCityInput } from "./dto/create-city.input";
import { UpdateCityInput } from "./dto/update-city.input";
import { City } from "./entities/city.entity";
import { FindAllCityInput } from "./dto/find-all-city.input";

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City) private readonly cityRepository: Repository<City>,
  ) {}
  public create(createCityInput: CreateCityInput) {
    const user = this.cityRepository.create(createCityInput);
    return this.cityRepository.save(user);
  }

  public findAll(filter: FindAllCityInput) {
    const query = this.cityRepository.createQueryBuilder("city").where("true");
    generateQuerySorts<City>(query, filter, City, "city");

    generateQueryConditions<City>(query, filter, "city");

    return customPaginate<City, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    cityOptions: FindOptionsWhere<City>,
    options?: {
      selected?: FindOptionsSelect<City>;
      relations?: FindOptionsRelations<City>;
    },
  ) {
    return this.cityRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: cityOptions,
    });
  }
  public async update(updateCityInput: UpdateCityInput) {
    await this.cityRepository.update(
      { id: updateCityInput.id },
      updateCityInput,
    );

    return this.findOne({ id: updateCityInput.id });
  }

  public remove(id: string) {
    this.cityRepository.delete({ id });
  }
}
