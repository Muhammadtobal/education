import { Field, ObjectType } from "@nestjs/graphql";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class ActivationCode {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @Field()
  id: string;

  @Column("varchar", { length: 6 })
  @Field()
  code: string;

  @Column("varchar", { length: 255, unique: true })
  @Field()
  phone: string;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @BeforeInsert()
  setExpiration() {
    // Set TTL to 10 min from the creation time
    this.expires_at = new Date(Date.now() + 10 * 60 * 1000);
  }
}
