import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BannerService } from './banner.service';
import { Banner } from './entities/banner.entity';
import { CreateBannerInput } from './dto/create-banner.input';
import { UpdateBannerInput } from './dto/update-banner.input';
import { BannerPaginationResultOutput } from './dto/find-all-banner.output';
import { FindAllBannerInput } from './dto/find-all-banner.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { UseGuards } from '@nestjs/common';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';

@Resolver(() => Banner)
export class BannerResolver {
  constructor(private readonly bannerService: BannerService) {}

  @Mutation(() => Banner)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + Banner.name)
  public createBanner(
    @Args('createBannerInput') createBannerInput: CreateBannerInput,
  ) {
    return this.bannerService.create(createBannerInput);
  }

  @Query(() => BannerPaginationResultOutput, { name: 'banners' })
  public findAll(@Args('filter') filter: FindAllBannerInput) {
    return this.bannerService.findAll(filter);
  }

  @Query(() => Banner, { name: 'banner' })
  public findOne(@Args('id') id: string) {
    return this.bannerService.findOne({ id });
  }

  @Mutation(() => Banner)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + Banner.name)
  public updateBanner(
    @Args('updateBannerInput') updateBannerInput: UpdateBannerInput,
  ) {
    return this.bannerService.update(updateBannerInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + Banner.name)
  public removeBanner(@Args('id') id: string) {
    this.bannerService.remove(id);
    return { done: true };
  }
}
