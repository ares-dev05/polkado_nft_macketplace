export interface TradeDto {
  collectionId: number;
  tokenId: number;
  price: string;
  quoteId: number;
  seller: string;
  metadata: object | null;
  creationDate: Date;
  buyer: string;
  tradeDate: Date;
}
