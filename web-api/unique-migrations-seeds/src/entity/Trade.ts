import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Offer } from "./Offer";

@Index("PK_Trade", ["id"], { unique: true })
@Index("IX_Trade_OfferId", ["offerId"], {})
@Entity("Trade", { schema: "public" })
export class Trade {
  @Column("uuid", { primary: true, name: "Id" })
  id!: string;

  @Column("timestamp without time zone", { name: "TradeDate" })
  tradeDate!: Date;

  @Column("text", { name: "Buyer" })
  buyer!: string;

  @Column("uuid", { name: "OfferId" })
  offerId!: string;

  @ManyToOne(() => Offer, (offer) => offer.trades, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "OfferId", referencedColumnName: "id" }])
  offer!: Offer;
}
