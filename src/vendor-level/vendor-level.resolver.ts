import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { VendorLevelService } from "./vendor-level.service";
import { VendorLevel } from "./entities/vendor-level.entity";
import { CreateVendorLevelInput } from "./dto/create-vendor-level.input";
import { UpdateVendorLevelInput } from "./dto/update-vendor-level.input";
import { VendorLevelPaginationResultOutput } from "./dto/find-all-vendor-level.output";
import { FindAllVendorLevelInput } from "./dto/find-all-vendor-level.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => VendorLevel)
export class VendorLevelResolver {
  constructor(private readonly vendorLevelService: VendorLevelService) {}

  @Mutation(() => VendorLevel)
  public createVendorLevel(
    @Args("createVendorLevelInput") createVendorLevelInput: CreateVendorLevelInput,
  ) {
    return this.vendorLevelService.create(createVendorLevelInput);
  }

  @Query(() => VendorLevelPaginationResultOutput, { name: "vendorLevels" })
  public findAll(@Args("filter") filter: FindAllVendorLevelInput) {
    return this.vendorLevelService.findAll(filter);
  }

  @Query(() => VendorLevel, { name: "vendorLevel" })
  public findOne(@Args("id") id: string) {
    return this.vendorLevelService.findOne({ id });
  }

  @Mutation(() => VendorLevel)
  public updateVendorLevel(
    @Args("updateVendorLevelInput") updateVendorLevelInput: UpdateVendorLevelInput,
  ) {
    return this.vendorLevelService.update(updateVendorLevelInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removeVendorLevel(@Args("id") id: string) {
    this.vendorLevelService.remove(id);
    return { done: true };
  }
}