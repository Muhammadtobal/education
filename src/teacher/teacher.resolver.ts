import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TeacherService } from './teacher.service';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherInput } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { TeacherPaginationResultOutput } from './dto/find-all-teacher.output';
import { FindAllTeacherInput } from './dto/find-all-teacher.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { CheckActivationTeacherCodeOutput } from 'src/auth/dto/check-activation-teacher-code.output';
import { ErrorMessages } from 'src/shared/error-messages.object';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { TeacherVendor } from './entities/teacher-vendor.entity';
import { CreateTeacherVendorInput } from './dto/create-teacher_vendor.input';
import { TeacherVendorPaginationResultOutput } from './dto/find-all-teacher_vendor.output';
import { FindAllTeacherVendorInput } from './dto/find-all-teacher_vendor.input';
import { UpdateTeacherVendorInput } from './dto/update-teacher_vendor.input';

@Resolver(() => Teacher)
export class TeacherResolver {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => CheckActivationTeacherCodeOutput)
  public async createTeacher(
    @Args('createTeacherInput')
    createTeacherInput: CreateTeacherInput,
  ) {
    const oldTeacher = await this.teacherService.findOne({
      phone: createTeacherInput.phone,
    });

    if (oldTeacher)
      throw new HttpException(
        ErrorMessages.USER_EXISTS_CONFLICT,
        HttpStatus.CONFLICT,
      );

    const activationCode = await this.userService.findOneActivationCode({
      phone: createTeacherInput.phone,
    });

    if (!activationCode || activationCode.code !== 'passed')
      throw new HttpException(
        ErrorMessages.ACTIVATION_CODE_UNAUTHORIZED,
        HttpStatus.CONFLICT,
      );

    const refreshToken = await this.authService.generateRefreshToken();

    const teacher = await this.teacherService.create({
      ...createTeacherInput,
      refresh_token: refreshToken,
    });

    const accessToken = await this.authService.generateJwtToken(
      { teacherId: teacher.id },
      process.env.TEACHER_JWT_KEY as string,
    );

    this.userService.removeActivationCode(activationCode.id);

    return {
      teacher: { ...teacher },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 15 * 60,
    };
  }

  @Query(() => TeacherPaginationResultOutput, { name: 'teachers' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Teacher.name)
  public findAll(@Args('filter') filter: FindAllTeacherInput) {
    return this.teacherService.findAll(filter);
  }

  @Query(() => Teacher, { name: 'teacher' })
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.GET + Teacher.name)
  public findOne(@Args('id') id: string) {
    return this.teacherService.findOne({ id });
  }

  @Mutation(() => Teacher)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.UPDATE + Teacher.name)
  public updateTeacher(
    @Args('updateTeacherInput') updateTeacherInput: UpdateTeacherInput,
  ) {
    return this.teacherService.update(updateTeacherInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.DELETE + Teacher.name)
  public removeTeacher(@Args('id') id: string) {
    this.teacherService.remove(id);
    return { done: true };
  }

  @Mutation(() => TeacherVendor)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + TeacherVendor.name)
  public createTeacherVendor(
    @Args('createTeacherVendorInput')
    createTeacherVendorInput: CreateTeacherVendorInput,
  ) {
    return this.teacherService.createTeacherVendor(createTeacherVendorInput);
  }

  @Query(() => TeacherVendorPaginationResultOutput, {
    name: 'teacher_vendors',
  })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + TeacherVendor.name)
  public findAllTeacherVendor(
    @Args('filter') filter: FindAllTeacherVendorInput,
  ) {
    return this.teacherService.findAllTeacherVendor(filter);
  }

  @Query(() => TeacherVendor, {
    name: 'teacher_vendor',
  })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + TeacherVendor.name)
  public findOneTeacherVendor(@Args('id') id: string) {
    return this.teacherService.findOneTeacherVendor({ id });
  }

  @Mutation(() => TeacherVendor)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + TeacherVendor.name)
  public updateTeacherVendor(
    @Args('updateTeacherVendorInput')
    updateTeacherVendorInput: UpdateTeacherVendorInput,
  ) {
    return this.teacherService.updateTeacherVendor(updateTeacherVendorInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + TeacherVendor.name)
  public removeTeacherVendor(@Args('id') id: string) {
    this.teacherService.removeTeacherVendor(id);

    return {
      done: true,
    };
  }
}
