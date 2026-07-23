import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { LevelService } from './level.service';
import { LevelResolver } from './level.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Level])],
  providers: [LevelService, LevelResolver],
})
export class LevelModule {}
