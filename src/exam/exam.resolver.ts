import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ExamService } from "./exam.service";
import { Exam } from "./entities/exam.entity";
import { CreateExamInput } from "./dto/create-exam.input";
import { UpdateExamInput } from "./dto/update-exam.input";
import { ExamPaginationResultOutput } from "./dto/find-all-exam.output";
import { FindAllExamInput } from "./dto/find-all-exam.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => Exam)
export class ExamResolver {
  constructor(private readonly examService: ExamService) {}

  @Mutation(() => Exam)
  public createExam(
    @Args("createExamInput") createExamInput: CreateExamInput,
  ) {
    return this.examService.create(createExamInput);
  }

  @Query(() => ExamPaginationResultOutput, { name: "exams" })
  public findAll(@Args("filter") filter: FindAllExamInput) {
    return this.examService.findAll(filter);
  }

  @Query(() => Exam, { name: "exam" })
  public findOne(@Args("id") id: string) {
    return this.examService.findOne({ id });
  }

  @Mutation(() => Exam)
  public updateExam(
    @Args("updateExamInput") updateExamInput: UpdateExamInput,
  ) {
    return this.examService.update(updateExamInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removeExam(@Args("id") id: string) {
    this.examService.remove(id);
    return { done: true };
  }
}