import { Column, Entity, Index } from "typeorm";

@Index("PK_QuoteOutgoingTransaction", ["id"], { unique: true })
@Index("IX_QuoteOutgoingTransaction_Status", ["status"], {})
@Entity("QuoteOutgoingTransaction", { schema: "public" })
export class QuoteOutgoingTransaction {
  @Column("uuid", { primary: true, name: "Id" })
  id!: string;

  @Column("integer", { name: "Status" })
  status!: number;

  @Column("text", { name: "ErrorMessage", nullable: true })
  errorMessage!: string | null;

  @Column("text", { name: "Value" })
  value!: string;

  @Column("numeric", { name: "QuoteId", precision: 20, scale: 0 })
  quoteId!: string;

  @Column("text", { name: "RecipientPublicKey" })
  recipientPublicKey!: string;

  @Column("integer", { name: "WithdrawType", default: () => "0" })
  withdrawType!: number;
}
