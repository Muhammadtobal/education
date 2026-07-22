import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Discussion } from "./entities/discussion.entity";
import { DiscussionService } from "./discussion.service";
import { DiscussionResolver } from "./discussion.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Discussion])],
  providers: [DiscussionService, DiscussionResolver],
})
export class DiscussionModule {}