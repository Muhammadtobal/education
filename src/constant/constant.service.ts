import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateConstantInput } from './dto/create-constant.input';
import { UpdateConstantInput } from './dto/update-constant.input';
import { Constant } from './entities/constant.entity';
import { AppService } from 'src/app.service';

@Injectable()
export class ConstantService {
  constructor(
    @InjectRepository(Constant)
    private readonly constantRepository: Repository<Constant>,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
  ) {}

  public create(createConstantInput: CreateConstantInput) {
    const constant = this.constantRepository.create(createConstantInput);
    return this.constantRepository.save(constant);
  }

  public findOne(
    constantOptions: FindOptionsWhere<Constant>,
    options?: {
      selected?: FindOptionsSelect<Constant>;
      relations?: FindOptionsRelations<Constant>;
    },
  ) {
    return this.constantRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: constantOptions,
    });
  }

  public async update(updateConstantInput: UpdateConstantInput) {
    await this.constantRepository.update(
      { key: updateConstantInput.key },
      updateConstantInput,
    );
    this.appService.setGlobalConstants;

    return this.findOne({ key: updateConstantInput.key });
  }

  public async findAll(expose?: boolean) {
    return this.constantRepository.find({ where: { expose } });
  }

  public async remove(id: string) {
    await this.constantRepository.delete({ id });
  }
}
