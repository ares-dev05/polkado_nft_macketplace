import { Column, Entity, Index } from "typeorm";

@Index("PK___EFMigrationsHistory", ["migrationId"], { unique: true })
@Entity("__EFMigrationsHistory", { schema: "public" })
export class EfMigrationsHistory {
  @Column("character varying", {
    primary: true,
    name: "MigrationId",
    length: 150,
  })
  migrationId!: string;

  @Column("character varying", { name: "ProductVersion", length: 32 })
  productVersion!: string;
}
