import { Column, Entity, Index } from "typeorm";

@Index("PK_NftOutgoingTransaction", ["id"], { unique: true })
@Index("IX_NftOutgoingTransaction_Status_LockTime", ["lockTime", "status"], {})
@Entity("NftOutgoingTransaction", { schema: "public" })
export class NftOutgoingTransaction {
  @Column("uuid", { primary: true, name: "Id" })
  id!: string;

  @Column("numeric", { name: "CollectionId", precision: 20, scale: 0 })
  collectionId!: string;

  @Column("numeric", { name: "TokenId", precision: 20, scale: 0 })
  tokenId!: string;

  @Column("text", { name: "Value" })
  value!: string;

  @Column("text", { name: "RecipientPublicKey" })
  recipientPublicKey!: string;

  @Column("integer", { name: "Status" })
  status!: number;

  @Column("timestamp without time zone", { name: "LockTime", nullable: true })
  lockTime!: Date | null;

  @Column("text", { name: "ErrorMessage", nullable: true })
  errorMessage!: string | null;
}
