import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { Content } from './entities/content.entity';
import { FindAllContentInput } from './dto/find-all-content.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    // private readonly subscriptionService: SubscriptionService,
    private readonly courseService: CourseService,
  ) {}
  public async create(createContentInput: CreateContentInput) {
    const content = this.contentRepository.create(createContentInput);

    if (createContentInput.has_children === false) {
      const course = await this.courseService.findOne({
        id: createContentInput.course_id,
      });
      if (course)
        await this.courseService.update({
          id: createContentInput.course_id,
          lessons_count: Number(course.lessons_count + 1),
        });
    }
    return this.contentRepository.save(content);
  }

  public findAll(filter: FindAllContentInput) {
    const query = this.contentRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.course', 'course')
      .leftJoinAndSelect('content.exam', 'exam')
      .where('true');

    if (filter.parent_content === true) {
      query.andWhere('content.parent_id IS NULL');
    }

    const { parent_content, ...contentFilter } = filter;
    generateQuerySorts<Content>(query, contentFilter, Content, 'content');
    generateQueryConditions<Content>(query, contentFilter, 'content');

    return customPaginate<Content, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    contentOptions: FindOptionsWhere<Content>,
    options?: {
      selected?: FindOptionsSelect<Content>;
      relations?: FindOptionsRelations<Content>;
    },
  ) {
    return this.contentRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: contentOptions,
    });
  }

  public async update(updateContentInput: UpdateContentInput) {
    await this.contentRepository.update(
      { id: updateContentInput.id },
      updateContentInput,
    );
    return this.findOne({ id: updateContentInput.id });
  }

  public remove(id: string) {
    this.contentRepository.delete(id);
  }

  // async getPlaybackUrl(userId: string, contentId: string) {
  //   await this.subscriptionService.checkContentAccess(userId, contentId);

  //   const content = await this.findOne({
  //     id: contentId,
  //   });
  //   if (!content) {
  //     throw new HttpException('not found', HttpStatus.BAD_REQUEST);
  //   }
  //   const playbackUrl = await this.videoService.generateSignedUrl(
  //     content.video_key,
  //   );

  //   return {
  //     playback_url: playbackUrl,
  //     expires_in: 300,
  //   };
  // }
}
