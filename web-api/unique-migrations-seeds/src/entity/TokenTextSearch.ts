import { Column, Entity, Index } from "typeorm";

@Index(
  "IX_TokenTextSearch_CollectionId_TokenId_Locale",
  ["collectionId", "locale", "tokenId"],
  {}
)
@Index("PK_TokenTextSearch", ["id"], { unique: true })
@Entity("TokenTextSearch", { schema: "public" })
export class TokenTextSearch {
  @Column("uuid", { primary: true, name: "Id" })
  id!: string;

  @Column("numeric", { name: "CollectionId", precision: 20, scale: 0 })
  collectionId!: string;

  @Column("numeric", { name: "TokenId", precision: 20, scale: 0 })
  tokenId!: string;

  @Column("text", { name: "Text" })
  text!: string;

  @Column("text", { name: "Locale", nullable: true })
  locale!: string | null;
}
