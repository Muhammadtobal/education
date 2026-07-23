import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Story } from "./entities/story.entity";
import { StoryService } from "./story.service";
import { StoryResolver } from "./story.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Story])],
  providers: [StoryService, StoryResolver],
})
export class StoryModule {}