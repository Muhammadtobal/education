import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VendorService } from './vendor.service';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { VendorPaginationResultOutput } from './dto/find-all-vendor.output';
import { FindAllVendorInput } from './dto/find-all-vendor.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { UseGuards } from '@nestjs/common';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';

@Resolver(() => Vendor)
export class VendorResolver {
  constructor(private readonly vendorService: VendorService) {}

  @Mutation(() => Vendor)
  @UseGuards(JwtAuthEmployeeGuard)
  public createVendor(
    @Args('createVendorInput') createVendorInput: CreateVendorInput,
  ) {
    return this.vendorService.create(createVendorInput);
  }

  @Query(() => VendorPaginationResultOutput, { name: 'vendors' })
  @UseGuards(JwtAuthEmployeeGuard)
  public findAll(@Args('filter') filter: FindAllVendorInput) {
    return this.vendorService.findAll(filter);
  }

  @Query(() => Vendor, { name: 'vendor' })
  @UseGuards(JwtAuthEmployeeGuard)
  public findOne(@Args('id') id: string) {
    return this.vendorService.findOne({ id });
  }

  @Mutation(() => Vendor)
  @UseGuards(JwtAuthEmployeeGuard)
  public updateVendor(
    @Args('updateVendorInput') updateVendorInput: UpdateVendorInput,
  ) {
    return this.vendorService.update(updateVendorInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  public removeVendor(@Args('id') id: string) {
    this.vendorService.remove(id);
    return { done: true };
  }
}
