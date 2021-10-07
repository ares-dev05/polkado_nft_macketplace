import { Column, Entity, Index } from "typeorm";

@Index("IX_QuoteIncomingTransaction_AccountPublicKey", ["accountPublicKey"], {})
@Index("PK_QuoteIncomingTransaction", ["id"], { unique: true })
@Index(
  "IX_QuoteIncomingTransaction_Status_LockTime",
  ["lockTime", "status"],
  {}
)
@Entity("QuoteIncomingTransaction", { schema: "public" })
export class QuoteIncomingTransaction {
  @Column("uuid", { primary: true, name: "Id" })
  id!: string;

  @Column("text", { name: "Amount" })
  amount!: string;

  @Column("numeric", { name: "QuoteId", precision: 20, scale: 0 })
  quoteId!: string;

  @Column("text", { name: "Description" })
  description!: string;

  @Column("text", { name: "AccountPublicKey" })
  accountPublicKey!: string;

  @Column("numeric", {
    name: "BlockId",
    nullable: true,
    precision: 20,
    scale: 0,
  })
  blockId!: string | null;

  @Column("integer", { name: "Status" })
  status!: number;

  @Column("timestamp without time zone", { name: "LockTime", nullable: true })
  lockTime!: Date | null;

  @Column("text", { name: "ErrorMessage", nullable: true })
  errorMessage!: string | null;
}
