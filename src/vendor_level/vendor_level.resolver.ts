import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { VendorLevelService } from './vendor_level.service';
import { VendorLevel } from './entities/vendor_level.entity';

import { CreateVendorLevelInput } from './dto/create-vendor_evel.input';
import { UpdateVendorLevelInput } from './dto/update-vendor_level.input';
import { VendorLevelPaginationResultOutput } from './dto/find-all-vendor_level.output';
import { FindAllVendorLevelInput } from './dto/find-all-vendor_level.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => VendorLevel)
export class VendorLevelResolver {
  constructor(private readonly vendorLevelService: VendorLevelService) {}

  @Mutation(() => VendorLevel)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + VendorLevel.name)
  public createVendorLevel(
    @Args('createVendorLevelInput')
    createVendorLevelInput: CreateVendorLevelInput,
  ) {
    return this.vendorLevelService.create(createVendorLevelInput);
  }

  @Query(() => VendorLevelPaginationResultOutput, { name: 'vendor_levels' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + VendorLevel.name)
  public findAll(@Args('filter') filter: FindAllVendorLevelInput) {
    return this.vendorLevelService.findAll(filter);
  }

  @Query(() => VendorLevel, { name: 'vendor_level' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + VendorLevel.name)
  public findOne(@Args('id') id: string) {
    return this.vendorLevelService.findOne({ id });
  }

  @Mutation(() => VendorLevel)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + VendorLevel.name)
  public updateVendorLevel(
    @Args('updateVendorLevelInput')
    updateVendorLevelInput: UpdateVendorLevelInput,
  ) {
    return this.vendorLevelService.update(updateVendorLevelInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + VendorLevel.name)
  public removeVendorLevel(@Args('id') id: string) {
    this.vendorLevelService.remove(id);

    return {
      done: true,
    };
  }
}
