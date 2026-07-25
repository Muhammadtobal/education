import { ObjectType, Field, Int } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Constant {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @Field()
  id: string;

  @Column("varchar", { length: 255 })
  @Field()
  key: string;

  @Column("simple-json")
  @Field(() => GraphQLJSON)
  value: Record<string, any>;

  @Column("boolean", { default: true })
  @Field()
  expose: boolean;
}
