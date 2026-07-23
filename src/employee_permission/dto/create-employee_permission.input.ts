import { InputType, Int, Field } from '@nestjs/graphql';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Employee } from 'src/employee/entities/employee.entity';
import { Permission } from 'src/permission/entities/permission.entity';

@InputType()
export class CreateEmployeePermissionInput {
  @Column('bigint')
  @Field()
  employee_id: string;

  @Column('bigint')
  @Field()
  permission_id: string;
}
