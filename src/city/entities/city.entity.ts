import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
@Entity()
@ObjectType()
export class City {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('varchar', { length: 255 })
  @Field()
  name: string;

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  updated_at: Date;

  @OneToMany(() => User, (user) => user.city)
  users: User[];

  @OneToMany(() => Employee, (employee) => employee.city)
  employees: Employee[];

  @OneToMany(() => Teacher, (teacher) => teacher.city)
  teachers: Teacher[];
}
