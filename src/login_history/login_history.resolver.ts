import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { LoginHistoryService } from "./login_history.service";
import { LoginHistory } from "./entities/login_history.entity";
import { CreateLoginHistoryInput } from "./dto/create-login_history.input";
import { UpdateLoginHistoryInput } from "./dto/update-login_history.input";
import { LoginHistoryPaginationResultOutput } from "./dto/find-all-login_history.output";
import { FindAllLoginHistoryInput } from "./dto/find-all-login_history.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => LoginHistory)
export class LoginHistoryResolver {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  @Mutation(() => LoginHistory)
  public createLoginHistory(
    @Args("createLoginHistoryInput") createLoginHistoryInput: CreateLoginHistoryInput,
  ) {
    return this.loginHistoryService.create(createLoginHistoryInput);
  }

  @Query(() => LoginHistoryPaginationResultOutput, { name: "loginHistorys" })
  public findAll(@Args("filter") filter: FindAllLoginHistoryInput) {
    return this.loginHistoryService.findAll(filter);
  }

  @Query(() => LoginHistory, { name: "loginHistory" })
  public findOne(@Args("id") id: string) {
    return this.loginHistoryService.findOne({ id });
  }

  @Mutation(() => LoginHistory)
  public updateLoginHistory(
    @Args("updateLoginHistoryInput") updateLoginHistoryInput: UpdateLoginHistoryInput,
  ) {
    return this.loginHistoryService.update(updateLoginHistoryInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removeLoginHistory(@Args("id") id: string) {
    this.loginHistoryService.remove(id);
    return { done: true };
  }
}