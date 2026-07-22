import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { AnswerService } from "./answer.service";
import { Answer } from "./entities/answer.entity";
import { CreateAnswerInput } from "./dto/create-answer.input";
import { UpdateAnswerInput } from "./dto/update-answer.input";
import { AnswerPaginationResultOutput } from "./dto/find-all-answer.output";
import { FindAllAnswerInput } from "./dto/find-all-answer.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Mutation(() => Answer)
  public createAnswer(
    @Args("createAnswerInput") createAnswerInput: CreateAnswerInput,
  ) {
    return this.answerService.create(createAnswerInput);
  }

  @Query(() => AnswerPaginationResultOutput, { name: "answers" })
  public findAll(@Args("filter") filter: FindAllAnswerInput) {
    return this.answerService.findAll(filter);
  }

  @Query(() => Answer, { name: "answer" })
  public findOne(@Args("id") id: string) {
    return this.answerService.findOne({ id });
  }

  @Mutation(() => Answer)
  public updateAnswer(
    @Args("updateAnswerInput") updateAnswerInput: UpdateAnswerInput,
  ) {
    return this.answerService.update(updateAnswerInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removeAnswer(@Args("id") id: string) {
    this.answerService.remove(id);
    return { done: true };
  }
}