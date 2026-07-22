import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { QuestionService } from "./question.service";
import { Question } from "./entities/question.entity";
import { CreateQuestionInput } from "./dto/create-question.input";
import { UpdateQuestionInput } from "./dto/update-question.input";
import { QuestionPaginationResultOutput } from "./dto/find-all-question.output";
import { FindAllQuestionInput } from "./dto/find-all-question.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Mutation(() => Question)
  public createQuestion(
    @Args("createQuestionInput") createQuestionInput: CreateQuestionInput,
  ) {
    return this.questionService.create(createQuestionInput);
  }

  @Query(() => QuestionPaginationResultOutput, { name: "questions" })
  public findAll(@Args("filter") filter: FindAllQuestionInput) {
    return this.questionService.findAll(filter);
  }

  @Query(() => Question, { name: "question" })
  public findOne(@Args("id") id: string) {
    return this.questionService.findOne({ id });
  }

  @Mutation(() => Question)
  public updateQuestion(
    @Args("updateQuestionInput") updateQuestionInput: UpdateQuestionInput,
  ) {
    return this.questionService.update(updateQuestionInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removeQuestion(@Args("id") id: string) {
    this.questionService.remove(id);
    return { done: true };
  }
}