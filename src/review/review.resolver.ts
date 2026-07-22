import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { ReviewPaginationResultOutput } from './dto/find-all-review.output';
import { FindAllReviewInput } from './dto/find-all-review.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Mutation(() => Review)
  @UseGuards(JwtAuthSharedGuard)
  public createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ) {
    return this.reviewService.create(createReviewInput);
  }

  @Query(() => ReviewPaginationResultOutput, { name: 'reviews' })
  @UseGuards(JwtAuthSharedGuard)
  public findAll(@Args('filter') filter: FindAllReviewInput) {
    return this.reviewService.findAll(filter);
  }

  @Query(() => Review, { name: 'review' })
  @UseGuards(JwtAuthSharedGuard)
  public findOne(@Args('id') id: string) {
    return this.reviewService.findOne({ id });
  }

  @Mutation(() => Review)
  @UseGuards(JwtAuthSharedGuard)
  public updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ) {
    return this.reviewService.update(updateReviewInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  public removeReview(@Args('id') id: string) {
    this.reviewService.remove(id);
    return { done: true };
  }
}
