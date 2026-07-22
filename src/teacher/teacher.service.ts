import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateTeacherInput } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { Teacher } from './entities/teacher.entity';
import { FindAllTeacherInput } from './dto/find-all-teacher.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}
  public create(createTeacherInput: CreateTeacherInput) {
    const teacher = this.teacherRepository.create(createTeacherInput);
    return this.teacherRepository.save(teacher);
  }

  public findAll(filter: FindAllTeacherInput) {
    const query = this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.vendor', 'vendor')

      .where('true');
    generateQuerySorts<Teacher>(query, filter, Teacher, 'teacher');
    generateQueryConditions<Teacher>(query, filter, 'teacher');

    return customPaginate<Teacher, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    teacherOptions: FindOptionsWhere<Teacher>,
    options?: {
      selected?: FindOptionsSelect<Teacher>;
      relations?: FindOptionsRelations<Teacher>;
    },
  ) {
    return this.teacherRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: teacherOptions,
    });
  }

  public async update(updateTeacherInput: UpdateTeacherInput) {
    await this.teacherRepository.update(
      { id: updateTeacherInput.id },
      updateTeacherInput,
    );
    return this.findOne({ id: updateTeacherInput.id });
  }

  public remove(id: string) {
    this.teacherRepository.delete(id);
  }
}
