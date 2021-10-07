import { Column, Entity, Index } from "typeorm";

@Index("PK_KusamaProcessedBlock", ["blockNumber"], { unique: true })
@Entity("KusamaProcessedBlock", { schema: "public" })
export class KusamaProcessedBlock {
  @Column("numeric", {
    primary: true,
    name: "BlockNumber",
    precision: 20,
    scale: 0,
  })
  blockNumber!: string;

  @Column("timestamp without time zone", { name: "ProcessDate" })
  processDate!: Date;
}
