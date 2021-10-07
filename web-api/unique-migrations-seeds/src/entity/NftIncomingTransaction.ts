import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Offer } from "./Offer";
import { UniqueProcessedBlock } from "./UniqueProcessedBlock";

@Index("PK_NftIncomingTransaction", ["id"], { unique: true })
@Index("IX_NftIncomingTransaction_Status_LockTime", ["lockTime", "status"], {})
@Index("IX_NftIncomingTransaction_OfferId", ["offerId"], {})
@Index(
  "IX_NftIncomingTransaction_UniqueProcessedBlockId",
  ["uniqueProcessedBlockId"],
  {}
)
@Entity("NftIncomingTransaction", { schema: "public" })
export class NftIncomingTransaction {
  @Column("uuid", { primary: true, name: "Id" })
  id!: string;

  @Column("bigint", { name: "CollectionId" })
  collectionId!: string;

  @Column("bigint", { name: "TokenId" })
  tokenId!: string;

  @Column("text", { name: "Value" })
  value!: string;

  @Column("text", { name: "OwnerPublicKey" })
  ownerPublicKey!: string;

  @Column("integer", { name: "Status" })
  status!: number;

  @Column("timestamp without time zone", { name: "LockTime", nullable: true })
  lockTime!: Date | null;

  @Column("text", { name: "ErrorMessage", nullable: true })
  errorMessage!: string | null;

  @Column("numeric", {
    name: "UniqueProcessedBlockId",
    precision: 20,
    scale: 0,
  })
  uniqueProcessedBlockId!: string;

  @Column("uuid", { name: "OfferId", nullable: true })
  offerId!: string | null;

  @ManyToOne(() => Offer, (offer) => offer.nftIncomingTransactions, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "OfferId", referencedColumnName: "id" }])
  offer!: Offer;

  @ManyToOne(
    () => UniqueProcessedBlock,
    (uniqueProcessedBlock) => uniqueProcessedBlock.nftIncomingTransactions,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([
    { name: "UniqueProcessedBlockId", referencedColumnName: "blockNumber" },
  ])
  uniqueProcessedBlock!: UniqueProcessedBlock;
}
