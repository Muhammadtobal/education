import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { StoryService } from './story.service';
import { Story } from './entities/story.entity';

import { CreateStoryInput } from './dto/create-story.input';
import { UpdateStoryInput } from './dto/update-story.input';
import { StoryPaginationResultOutput } from './dto/find-all-story.output';
import { FindAllStoryInput } from './dto/find-all-story.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

import { GqlContext } from 'src/shared/types/context';
import { getEmpId, getEmpVendors } from 'src/shared/helpers';
import { EmployeeVendorService } from 'src/employee_vendor/employee_vendor.service';

@Resolver(() => Story)
export class StoryResolver {
  constructor(
    private readonly storyService: StoryService,
    private readonly employeeVendorService: EmployeeVendorService,
  ) {}

  @Mutation(() => Story)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Story.name)
  public async createStory(
    @Args('createStoryInput') createStoryInput: CreateStoryInput,
    @Context() context: GqlContext,
  ) {
    const empId = getEmpId(context.req.user);
    const vendors = getEmpVendors(context.req.user);

    if (vendors.length > 0 && empId && createStoryInput.vendor_id) {
      await this.employeeVendorService.validateEmployeeVendor(
        empId,
        createStoryInput.vendor_id,
      );
    }

    return this.storyService.create(createStoryInput);
  }

  @Query(() => StoryPaginationResultOutput, { name: 'stories' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Story.name)
  public findAll(
    @Args('filter') filter: FindAllStoryInput,
    @Context() context: GqlContext,
  ) {
    const empId = getEmpId(context.req.user);
    const vendors = getEmpVendors(context.req.user);

    if (vendors.length > 0 && empId) {
      return this.storyService.findAll({
        ...filter,
        vendor_id: {
          ids: vendors.map((vendor) => vendor.vendor_id),
        },
      });
    }

    return this.storyService.findAll(filter);
  }

  @Query(() => Story, { name: 'story' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Story.name)
  public async findOne(@Args('id') id: string, @Context() context: GqlContext) {
    const empId = getEmpId(context.req.user);
    const vendors = getEmpVendors(context.req.user);

    const story = await this.storyService.findOne({ id });

    if (vendors.length > 0 && empId && story && story.vendor_id) {
      await this.employeeVendorService.validateEmployeeVendor(
        empId,
        story.vendor_id,
      );
    }

    return story;
  }

  @Mutation(() => Story)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Story.name)
  public updateStory(
    @Args('updateStoryInput') updateStoryInput: UpdateStoryInput,
  ) {
    return this.storyService.update(updateStoryInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Story.name)
  public removeStory(@Args('id') id: string) {
    this.storyService.remove(id);

    return {
      done: true,
    };
  }
}
