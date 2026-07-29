import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { CreateCityInput } from './dto/create-city.input';
import { UpdateCityInput } from './dto/update-city.input';
import { FindAllCityInput } from './dto/find-all-city.input';
import { CityPaginationResultOutput } from './dto/find-all-city.output';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
@Resolver(() => City)
export class CityResolver {
  constructor(private readonly cityService: CityService) {}

  @Mutation(() => City)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + City.name)
  public createCity(@Args('createCityInput') createCityInput: CreateCityInput) {
    return this.cityService.create(createCityInput);
  }

  @Query(() => CityPaginationResultOutput, { name: 'cities' })
  @Permissions(Operation.GET + City.name)
  public findAll(@Args('filter') filter: FindAllCityInput) {
    return this.cityService.findAll(filter);
  }

  @Query(() => City, { name: 'city' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + City.name)
  public findOne(@Args('id') id: string) {
    return this.cityService.findOne({ id });
  }

  @Mutation(() => City)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.UPDATE + City.name)
  public updateCity(@Args('updateCityInput') updateCityInput: UpdateCityInput) {
    return this.cityService.update(updateCityInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.DELETE + City.name)
  public removeCity(@Args('id') id: string) {
    this.cityService.remove(id);

    return {
      done: true,
    };
  }
}
