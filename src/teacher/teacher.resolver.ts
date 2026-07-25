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
  public findAll(@Args('filter') filter: FindAllTeacherInput) {
    return this.teacherService.findAll(filter);
  }

  @Query(() => Teacher, { name: 'teacher' })
  @UseGuards(JwtAuthEmployeeGuard)
  public findOne(@Args('id') id: string) {
    return this.teacherService.findOne({ id });
  }

  @Mutation(() => Teacher)
  @UseGuards(JwtAuthEmployeeGuard)
  public updateTeacher(
    @Args('updateTeacherInput') updateTeacherInput: UpdateTeacherInput,
  ) {
    return this.teacherService.update(updateTeacherInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  public removeTeacher(@Args('id') id: string) {
    this.teacherService.remove(id);
    return { done: true };
  }
}
