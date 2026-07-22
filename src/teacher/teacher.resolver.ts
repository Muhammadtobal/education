import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TeacherService } from './teacher.service';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherInput } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { TeacherPaginationResultOutput } from './dto/find-all-teacher.output';
import { FindAllTeacherInput } from './dto/find-all-teacher.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { UseGuards } from '@nestjs/common';
import { JwtAuthVendorGuard } from 'src/auth/guards/jwt-auth-vendor.guard';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';

@Resolver(() => Teacher)
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}

  @Mutation(() => Teacher)
  @UseGuards(JwtAuthVendorGuard)
  public createTeacher(
    @Args('createTeacherInput') createTeacherInput: CreateTeacherInput,
  ) {
    return this.teacherService.create(createTeacherInput);
  }

  @Query(() => TeacherPaginationResultOutput, { name: 'teachers' })
  @UseGuards(JwtAuthSharedGuard)
  public findAll(@Args('filter') filter: FindAllTeacherInput) {
    return this.teacherService.findAll(filter);
  }

  @Query(() => Teacher, { name: 'teacher' })
  @UseGuards(JwtAuthVendorGuard)
  public findOne(@Args('id') id: string) {
    return this.teacherService.findOne({ id });
  }

  @Mutation(() => Teacher)
  @UseGuards(JwtAuthVendorGuard)
  public updateTeacher(
    @Args('updateTeacherInput') updateTeacherInput: UpdateTeacherInput,
  ) {
    return this.teacherService.update(updateTeacherInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthVendorGuard)
  public removeTeacher(@Args('id') id: string) {
    this.teacherService.remove(id);
    return { done: true };
  }
}
