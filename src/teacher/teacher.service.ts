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
import { TeacherVendor } from './entities/teacher-vendor.entity';
import { CreateTeacherVendorInput } from './dto/create-teacher_vendor.input';
import { FindAllTeacherVendorInput } from './dto/find-all-teacher_vendor.input';
import { UpdateTeacherVendorInput } from './dto/update-teacher_vendor.input';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(TeacherVendor)
    private readonly teacherVendorRepository: Repository<TeacherVendor>,
  ) {}
  public create(createTeacherInput: CreateTeacherInput) {
    const teacher = this.teacherRepository.create(createTeacherInput);
    return this.teacherRepository.save(teacher);
  }

  public findAll(filter: FindAllTeacherInput) {
    const query = this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.city', 'city')

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

  public createTeacherVendor(
    createTeacherVendorInput: CreateTeacherVendorInput,
  ) {
    const teacherVendor = this.teacherVendorRepository.create(
      createTeacherVendorInput,
    );

    return this.teacherVendorRepository.save(teacherVendor);
  }

  public findAllTeacherVendor(filter: FindAllTeacherVendorInput) {
    const query = this.teacherVendorRepository
      .createQueryBuilder('teacherVendor')

      .leftJoinAndSelect('teacherVendor.teacher', 'teacher')
      .leftJoinAndSelect('teacherVendor.vendor', 'vendor')
      .where('true');

    generateQuerySorts<TeacherVendor>(
      query,
      filter,
      TeacherVendor,
      'teacherVendor',
    );

    generateQueryConditions<TeacherVendor>(query, filter, 'teacherVendor');

    return customPaginate<TeacherVendor, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOneTeacherVendor(
    teacherVendorOptions: FindOptionsWhere<TeacherVendor>,
    options?: {
      selected?: FindOptionsSelect<TeacherVendor>;
      relations?: FindOptionsRelations<TeacherVendor>;
    },
  ) {
    return this.teacherVendorRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: teacherVendorOptions,
    });
  }

  public async updateTeacherVendor(
    updateTeacherVendorInput: UpdateTeacherVendorInput,
  ) {
    await this.teacherVendorRepository.update(
      { id: updateTeacherVendorInput.id },
      updateTeacherVendorInput,
    );

    return this.findOneTeacherVendor({
      id: updateTeacherVendorInput.id,
    });
  }

  public removeTeacherVendor(id: string) {
    return this.teacherVendorRepository.delete(id);
  }
}
