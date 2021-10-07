import {Column,Entity,Index,OneToMany} from "typeorm";
import {NftIncomingTransaction} from './NftIncomingTransaction'
import {Trade} from './Trade'
import {priceTransformer} from "../price-transformer";


@Index("IX_Offer_OfferStatus_CollectionId_TokenId",["collectionId","offerStatus","tokenId",],{  })
@Index("IX_Offer_CreationDate",["creationDate",],{  })
@Index("PK_Offer",["id",],{ unique:true })
@Index("IX_Offer_Metadata",["metadata",],{  })
@Entity("Offer" ,{schema:"public" } )
export  class Offer {

@Column("uuid",{ primary:true,name:"Id" })
id!:string;

@Column("timestamp without time zone",{ name:"CreationDate" })
creationDate!:Date;

@Column("numeric",{ name:"CollectionId",precision:20,scale:0 })
collectionId!:string;

@Column("numeric",{ name:"TokenId",precision:20,scale:0 })
tokenId!:string;

@Column("text",{name:"Price", transformer: priceTransformer })
price!:bigint;

@Column("text",{ name:"Seller" })
seller!:string;

@Column("integer",{ name:"OfferStatus" })
offerStatus!:number;

@Column("bytea",{ name:"SellerPublicKeyBytes", })
sellerPublicKeyBytes!:Buffer;

@Column("numeric",{ name:"QuoteId",precision:20,scale:0,default: () => "2.0", })
quoteId!:string;

@Column("jsonb",{ name:"Metadata",nullable:true })
metadata!:object | null;

@OneToMany(()=>NftIncomingTransaction,nftIncomingTransaction=>nftIncomingTransaction.offer)


nftIncomingTransactions!:NftIncomingTransaction[];

@OneToMany(()=>Trade,trade=>trade.offer)


trades!:Trade[];

}
