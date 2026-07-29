import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeePermission } from 'src/employee_permission/entities/employee_permission.entity';

@Entity()
@ObjectType()
export class Permission {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('varchar', { length: 255 })
  @Field()
  name: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  translation?: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  for_vendor: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  updated_at: Date;

  @OneToMany(
    () => EmployeePermission,
    (employeePermission) => employeePermission.permission,
  )
  employee_permissions: EmployeePermission[];
}
