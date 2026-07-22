import { ObjectType, Field, Int } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Employee } from "src/employee/entities/employee.entity";
import { Permission } from "src/permission/entities/permission.entity";
@Entity()
@ObjectType()
export class EmployeePermission {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @Field()
  id: string;

  @Column("bigint")
  @Field()
  employee_id: string;

  @Column("bigint")
  @Field()
  permission_id: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  @Field()
  created_at: Date;

  @ManyToOne(() => Employee, (employee) => employee.employee_permissions)
  @JoinColumn({ name: "employee_id" })
  @Field(() => Employee, { nullable: true })
  employee?: Employee;

  @ManyToOne(() => Permission, (permission) => permission.employee_permissions)
  @JoinColumn({ name: "permission_id" })
  @Field(() => Permission, { nullable: true })
  permission?: Permission;
}
