import { Column, Entity, Index, OneToMany } from "typeorm";
import { NftIncomingTransaction } from "./NftIncomingTransaction";

@Index("PK_UniqueProcessedBlock", ["blockNumber"], { unique: true })
@Entity("UniqueProcessedBlock", { schema: "public" })
export class UniqueProcessedBlock {
  @Column("numeric", {
    primary: true,
    name: "BlockNumber",
    precision: 20,
    scale: 0,
  })
  blockNumber!: string;

  @Column("timestamp without time zone", { name: "ProcessDate" })
  processDate!: Date;

  @OneToMany(
    () => NftIncomingTransaction,
    (nftIncomingTransaction) => nftIncomingTransaction.uniqueProcessedBlock
  )
  nftIncomingTransactions!: NftIncomingTransaction[];
}
