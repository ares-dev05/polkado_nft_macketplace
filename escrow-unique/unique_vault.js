const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { Abi, ContractPromise } = require("@polkadot/api-contract");
const { hexToU8a } = require('@polkadot/util');
const { decodeAddress, encodeAddress } = require('@polkadot/util-crypto');
const config = require('./config');
const { v4: uuidv4 } = require('uuid');
const { connect, log } = require('./lib');
const fs = require('fs');
const {
  decodeTokenMeta,
  decodeSearchKeywords
} = require('./token-decoder');

var BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 12, ROUNDING_MODE: BigNumber.ROUND_DOWN, decimalSeparator: '.' });

const { Client } = require('pg');
let dbClient = null;

const incomingTxTable = "NftIncomingTransaction";
const incomingQuoteTxTable = "QuoteIncomingTransaction";
const offerTable = "Offer";
const tradeTable = "Trade";
const outgoingQuoteTxTable = "QuoteOutgoingTransaction";
// const outgoingTxTable = "NftOutgoingTransaction";
const uniqueBlocksTable = "UniqueProcessedBlock";
let adminAddress;

const contractAbi = require("./market_metadata.json");

const quoteId = 2; // KSM

let bestBlockNumber = 0; // The highest block in chain (not final)
let timer;

let resolver = null;
function delay(ms) {
  return new Promise(async (resolve, reject) => {
    resolver = resolve;
    timer = setTimeout(() => {
      resolver = null;
      resolve();
    }, ms);
  });
}

function cancelDelay() {
  clearTimeout(timer);
  if (resolver) resolver();
}

function toHuman(obj) {
  if(obj === undefined || obj === null) {
    return undefined;
  }

  if('toHuman' in obj) {
    return obj.toHuman();
  }

  if(Array.isArray(obj)) {
    return obj.map(toHuman).join(', ');
  }

  if(typeof obj === 'object') {
    for(let k of Object.keys(obj)) {
      const h = toHuman(obj);
      if(h) {
        return h;
      }
    }
  }

  return undefined;
}

async function getDbConnection() {
  if (!dbClient) {
    dbClient = new Client({
      user: config.dbUser,
      host: config.dbHost,
      database: config.dbName,
      password: config.dbPassword,
      port: config.dbPort
    });
    dbClient.connect();
    log("Connected to the DB");
  }
  return dbClient;
}

async function getLastHandledUniqueBlock(api) {
  const conn = await getDbConnection();
  const selectLastHandledUniqueBlockSql = `SELECT * FROM public."${uniqueBlocksTable}" ORDER BY public."${uniqueBlocksTable}"."BlockNumber" DESC LIMIT 1;`;
  const res = await conn.query(selectLastHandledUniqueBlockSql);
  const lastBlock = (res.rows.length > 0) ? res.rows[0].BlockNumber : await getAndStoreStartingBlock(api);
  return lastBlock;
}

async function getAndStoreStartingBlock(api) {
  let startingBlock;
  if('current'.localeCompare(config.startFromBlock, undefined, {sensitivity: 'accent'}) === 0) {
    const head = await api.rpc.chain.getHeader();
    startingBlock = head.number.toNumber();
  } else {
    startingBlock = parseInt(config.startFromBlock);
  }

  await addHandledUniqueBlock(startingBlock);
  return startingBlock;
}

async function addHandledUniqueBlock(blockNumber) {
  const conn = await getDbConnection();
  const insertHandledBlocSql = `INSERT INTO public."${uniqueBlocksTable}" VALUES ($1, now());`;
  await conn.query(insertHandledBlocSql, [blockNumber]);
}

async function addIncomingNFTTransaction(address, collectionId, tokenId, blockNumber) {
  const conn = await getDbConnection();

  // Convert address into public key
  const publicKey = Buffer.from(decodeAddress(address), 'binary').toString('base64');

  // Clear all previous appearances of this NFT with status 0, update to error
  const errorMessage = "Failed to register (sync err)";
  const updateIncomingNftSql = `UPDATE public."${incomingTxTable}"
    SET  "Status" = 2, "ErrorMessage" = $1
    WHERE "Status" = 0 AND "CollectionId" = $2 AND "TokenId" = $3;`;
  await conn.query(updateIncomingNftSql, [errorMessage, collectionId, tokenId]);

  // Clear all previous appearances of this NFT with null orderId
  const updateNftIncomesSql = `DELETE FROM public."${incomingTxTable}"
    WHERE "OfferId" IS NULL AND "CollectionId" = $1 AND "TokenId" = $2;`
  await conn.query(updateNftIncomesSql, [collectionId, tokenId]);

  // Add incoming NFT with Status = 0
  const insertIncomingNftSql = `INSERT INTO public."${incomingTxTable}"("Id", "CollectionId", "TokenId", "Value", "OwnerPublicKey", "UniqueProcessedBlockId", "Status", "LockTime", "ErrorMessage") VALUES ($1, $2, $3, 0, $4, $5, 0, now(), '');`;
  await conn.query(insertIncomingNftSql, [uuidv4(), collectionId, tokenId, publicKey, blockNumber]);
}

async function setIncomingNftTransactionStatus(id, status, error = "OK") {
  const conn = await getDbConnection();

  const updateIncomingNftStatusSql = `UPDATE public."${incomingTxTable}" SET "Status" = $1, "ErrorMessage" = $2 WHERE "Id" = $3`;

  // Get one non-processed Kusama transaction
  await conn.query(updateIncomingNftStatusSql, [status, error, id]);
}

async function getIncomingNFTTransaction() {
  const conn = await getDbConnection();

  const getIncomingNftsSql = `SELECT * FROM public."${incomingTxTable}"
    WHERE "Status" = 0`;
  // Get one non-processed incoming NFT transaction
  // Id | CollectionId | TokenId | Value | OwnerPublicKey | Status | LockTime | ErrorMessage | UniqueProcessedBlockId
  const res = await conn.query(getIncomingNftsSql);

  let nftTx = {
    id: '',
    collectionId: 0,
    tokenId: 0,
    sender: null
  };

  if (res.rows.length > 0) {
    let publicKey = Buffer.from(res.rows[0].OwnerPublicKey, 'base64');

    try {
      // Convert public key into address
      const address = encodeAddress(publicKey);

      nftTx.id = res.rows[0].Id;
      nftTx.collectionId = res.rows[0].CollectionId;
      nftTx.tokenId = res.rows[0].TokenId;
      nftTx.sender = address;
    }
    catch (e) {
      setIncomingNftTransactionStatus(res.rows[0].Id, 2, e.toString());
      log(e, "ERROR");
    }

  }

  return nftTx;
}

async function addOffer(seller, collectionId, tokenId, quoteId, price, metadata, searchKeywords) {
  const conn = await getDbConnection();

  // Convert address into public key
  const publicKey = Buffer.from(decodeAddress(seller), 'binary').toString('base64');

  const inserOfferSql = `INSERT INTO public."${offerTable}"("Id", "CreationDate", "CollectionId", "TokenId", "Price", "Seller", "Metadata", "OfferStatus", "SellerPublicKeyBytes", "QuoteId")
    VALUES ($1, now(), $2, $3, $4, $5, $6, 1, $7, $8);`;
  const offerId = uuidv4();
  //Id | CreationDate | CollectionId | TokenId | Price | Seller | Metadata | OfferStatus | SellerPublicKeyBytes | QuoteId
  await conn.query(inserOfferSql, [offerId, collectionId, tokenId, price.padStart(40, '0'), publicKey, metadata, decodeAddress(seller), quoteId]);

  const updateNftIncomesSql = `UPDATE public."${incomingTxTable}"
	SET "OfferId"=$1
	WHERE "CollectionId" = $2 AND "TokenId" = $3 AND "OfferId" IS NULL;`
  await conn.query(updateNftIncomesSql, [offerId, collectionId, tokenId]);

  await saveSearchKeywords(conn, collectionId, tokenId, searchKeywords);
}

async function saveSearchKeywords(conn, collectionId, tokenId, searchKeywords) {
  if(searchKeywords.length <= 0) {
    return;
  }

  const keywordsStored = await conn.query(`SELECT Max("CollectionId") from public."TokenTextSearch"
    WHERE "CollectionId" = $1 AND "TokenId" = $2`,
    [collectionId, tokenId]
  );
  if(keywordsStored.rows.length < 0) {
    return;
  }

  await Promise.all(searchKeywords.map(({locale, text}) =>
    conn.query(`INSERT INTO public."TokenTextSearch"
("Id", "CollectionId", "TokenId", "Text", "Locale") VALUES
($1, $2, $3, $4, $5);`, [uuidv4(), collectionId, tokenId, text, locale]))
  );
}

async function getOpenOfferId(collectionId, tokenId) {
  const conn = await getDbConnection();
  const selectOpenOffersSql = `SELECT * FROM public."${offerTable}" WHERE "CollectionId" = ${collectionId} AND "TokenId" = ${tokenId} AND "OfferStatus" = 1;`;
  const res = await conn.query(selectOpenOffersSql);
  const id = (res.rows.length > 0) ? res.rows[0].Id : '';
  return id;
}

async function updateOffer(collectionId, tokenId, newStatus) {
  const conn = await getDbConnection();

  const id = await getOpenOfferId(collectionId, tokenId);

  const updateOfferSql = `UPDATE public."${offerTable}" SET "OfferStatus" = ${newStatus} WHERE "Id" = '${id}'`;
  // Only update active offer (should be one)
  await conn.query(updateOfferSql);

  return id;
}

async function addTrade(offerId, buyer) {
  const conn = await getDbConnection();

  // Convert address into public key
  const publicKey = Buffer.from(decodeAddress(buyer), 'binary').toString('base64');

  const insertTradeSql = `INSERT INTO public."${tradeTable}"("Id", "TradeDate", "Buyer", "OfferId")
    VALUES ($1, now(), $2, $3);`;
  await conn.query(insertTradeSql,
    [uuidv4(), publicKey, offerId]);
}

async function addOutgoingQuoteTransaction(quoteId, amount, recipient, withdrawType) {
  const conn = await getDbConnection();

  // Convert address into public key
  const publicKey = Buffer.from(decodeAddress(recipient), 'binary').toString('base64');

  const insertOutgoingQuoteTransactionSql = `INSERT INTO public."${outgoingQuoteTxTable}"("Id", "Status", "ErrorMessage", "Value", "QuoteId", "RecipientPublicKey", "WithdrawType")
    VALUES ($1, 0, '', $2, $3, $4, $5);`;
  // Id | Status | ErrorMessage | Value | QuoteId | RecipientPublicKey | WithdrawType
  // WithdrawType == 1 => Withdraw matched
  //                 0 => Unused
  await conn.query(insertOutgoingQuoteTransactionSql, [uuidv4(), amount, parseInt(quoteId), publicKey, withdrawType]);
}

async function setIncomingKusamaTransactionStatus(id, status, error = "OK") {
  const conn = await getDbConnection();

  const updateIncomingKusamaTransactionStatusSql = `UPDATE public."${incomingQuoteTxTable}" SET "Status" = $1, "ErrorMessage" = $2 WHERE "Id" = $3`;
  // Get one non-processed Kusama transaction
  await conn.query(updateIncomingKusamaTransactionStatusSql, [status, error, id]);
}

async function getIncomingKusamaTransaction() {
  const conn = await getDbConnection();

  const selectIncomingQuoteTxsSql = `SELECT * FROM public."${incomingQuoteTxTable}"
    WHERE
      "Status" = 0
      AND "QuoteId" = 2 LIMIT 1
  `;
  // Get one non-processed incoming Kusama transaction
  // Id | Amount | QuoteId | Description | AccountPublicKey | BlockId | Status | LockTime | ErrorMessage
  const res = await conn.query(selectIncomingQuoteTxsSql);

  let ksmTx = {
    id: '',
    amount: '0',
    sender: null
  };

  if (res.rows.length > 0) {
    let publicKey = res.rows[0].AccountPublicKey;

    try {
      if ((publicKey[0] != '0') || (publicKey[1] != 'x'))
        publicKey = '0x' + publicKey;

      // Convert public key into address
      const address = encodeAddress(hexToU8a(publicKey));

      ksmTx.id = res.rows[0].Id;
      ksmTx.sender = address;
      ksmTx.amount = res.rows[0].Amount;
    }
    catch (e) {
      setIncomingKusamaTransactionStatus(res.rows[0].Id, 2, e.toString());
      log(e, "ERROR");
    }

  }

  return ksmTx;
}


function getTransactionStatus(events, status) {
  if (status.isReady) {
    return "NotReady";
  }
  if (status.isBroadcast) {
    return "NotReady";
  }
  if (status.isInBlock || status.isFinalized) {
    const errors = events.filter(e => e.event.data.method === 'ExtrinsicFailed');
    if(errors.length > 0) {
      log(`Transaction failed, ${toHuman(errors)}`, 'ERROR');
      return "Fail";
    }
    if(events.filter(e => e.event.data.method === 'ExtrinsicSuccess').length > 0) {
      return "Success";
    }
  }

  return "Fail";
}

function sendTransactionAsync(sender, transaction) {
  return new Promise(async (resolve, reject) => {
    try {
      let unsub = await transaction.signAndSend(sender, ({ events = [], status }) => {
        const transactionStatus = getTransactionStatus(events, status);

        if (transactionStatus === "Success") {
          log(`Transaction successful`);
          resolve(events);
          unsub();
        } else if (transactionStatus === "Fail") {
          log(`Something went wrong with transaction. Status: ${status}`);
          reject(events);
          unsub();
        }
      });
    } catch (e) {
      log('Error: ' + e.toString(), "ERROR");
      reject(e);
    }
  });

}

async function registerQuoteDepositAsync({api, sender, depositorAddress, amount}) {
  log(`${depositorAddress} deposited ${amount} in ${quoteId} currency`);

  const abi = new Abi(contractAbi);
  const contract = new ContractPromise(api, abi, config.marketContractAddress);

  const value = 0;
  const maxgas = 1000000000000;

  let amountBN = new BigNumber(amount);
  const tx = contract.tx.registerDeposit(value, maxgas, quoteId, amountBN.toString(), depositorAddress);
  await sendTransactionAsync(sender, tx);
}

async function registerNftDepositAsync(api, sender, depositorAddress, collection_id, token_id) {
  log(`${depositorAddress} deposited ${collection_id}, ${token_id}`);
  const abi = new Abi(contractAbi);
  const contract = new ContractPromise(api, abi, config.marketContractAddress);

  const value = 0;
  const maxgas = 1000000000000;

  // if (blackList.includes(token_id)) {
  //   log(`Blacklisted NFT received. Silently returning.`, "WARNING");
  //   return;
  // }

  const tx = contract.tx.registerNftDeposit(value, maxgas, collection_id, token_id, depositorAddress);
  await sendTransactionAsync(sender, tx);
}

function beHexToNum(beHex) {
  const arr = hexToU8a(beHex);
  let strHex = '';
  for (let i=arr.length-1; i>=0; i--) {
    let digit = arr[i].toString(16);
    if (arr[i] <= 15) digit = '0' + digit;
    strHex += digit;
  }
  return new BigNumber(strHex, 16);
}

async function sendNftTxAsync(api, sender, recipient, collection_id, token_id) {
  const tx = api.tx.nft
    .transfer(recipient, collection_id, token_id, 0);
  await sendTransactionAsync(sender, tx);
}

function isSuccessfulExtrinsic(eventRecords, extrinsicIndex) {
  const events = eventRecords
    .filter(({ phase }) =>
      phase.isApplyExtrinsic &&
      phase.asApplyExtrinsic.eq(extrinsicIndex)
    )
    .map(({ event }) => `${event.section}.${event.method}`);

  return events.includes('system.ExtrinsicSuccess');

}

async function scanNftBlock(api, admin, blockNum) {

  if (blockNum % 10 == 0) log(`Scanning Block #${blockNum}`);
  const blockHash = await api.rpc.chain.getBlockHash(blockNum);

  // Memo: If it fails here, check custom types
  const signedBlock = await api.rpc.chain.getBlock(blockHash);
  const allRecords = await api.query.system.events.at(blockHash);

  const abi = new Abi(contractAbi);

  // log(`Reading Block ${blockNum} Transactions`);

  for (let [extrinsicIndex, ex] of signedBlock.block.extrinsics.entries()) {

    // skip unsuccessful  extrinsics.
    if (!isSuccessfulExtrinsic(allRecords, extrinsicIndex)) {
      continue;
    }

    const { _isSigned, _meta, method: { args, method, section } } = ex;

    if ((section == "nft") && (method == "transfer") && (args[0] == admin.address.toString())) {
      log(`NFT deposit from ${ex.signer.toString()} id (${args[1]}, ${args[2]})`, "RECEIVED");

      const address = ex.signer.toString();
      const collectionId = args[1];
      const tokenId = args[2];

      const paraments = {
        api,
        userAddress: address,
        sender: admin,
        marketContractAddress: config.marketContractAddress,
      };
      // Add sender to contract white list
      await addWhiteList(paraments);

      // Save in the DB
      await addIncomingNFTTransaction(address, collectionId, tokenId, blockNum);
    }
    else if ((section == "contracts") && (method == "call") && (args[0].toString() == config.marketContractAddress)) {
      try {
        log(`Contract call in block ${blockNum}: ${args[0].toString()}, ${args[1].toString()}, ${args[2].toString()}, ${args[3].toString()}`);

        let data = args[3].toString();
        log(`data = ${data}`);

        // Ask call
        if (data.startsWith("0x020f741e")) {
          log(`======== Ask Call`);
          //    CallID   collection       token            quote            price
          // 0x 020f741e 0300000000000000 1200000000000000 0200000000000000 0080c6a47e8d03000000000000000000
          //    0        4                12               20               28

          if (data.substring(0,2) === "0x") data = data.substring(2);
          const collectionIdHex = "0x" + data.substring(8, 24);
          const tokenIdHex = "0x" + data.substring(24, 40);
          const quoteIdHex = "0x" + data.substring(40, 56);
          const priceHex = "0x" + data.substring(56);
          const collectionId = beHexToNum(collectionIdHex).toString();
          const tokenId = beHexToNum(tokenIdHex).toString();
          const quoteId = beHexToNum(quoteIdHex).toString();
          const price = beHexToNum(priceHex).toFixed();
          log(`${ex.signer.toString()} listed ${collectionId}-${tokenId} in block ${blockNum} hash: ${blockHash} for ${quoteId}-${price}`);

          const [collection, token] = await Promise.all([api.query.nft.collectionById(collectionId), api.query.nft.nftItemList(collectionId, tokenId)]);

          const tokenMeta = decodeTokenMeta(collection, token) || {};
          const tokenSearchKeywords = decodeSearchKeywords(collection, token, tokenId) || [];

          await addOffer(ex.signer.toString(), collectionId, tokenId, quoteId, price, tokenMeta, tokenSearchKeywords);
        }

        // Buy call
        if (data.startsWith("0x15d62801")) {
          const withdrawNFTEvent = findMatcherEvent(allRecords, abi, extrinsicIndex, 'WithdrawNFT');
          const withdrawQuoteMatchedEvent = findMatcherEvent(allRecords, abi, extrinsicIndex, 'WithdrawQuoteMatched');
          await handleBuyCall(api, admin, withdrawNFTEvent, withdrawQuoteMatchedEvent);
        }

        // Cancel: 0x9796e9a703000000000000000100000000000000
        if (data.startsWith("0x9796e9a7")) {
          const withdrawNFTEvent = findMatcherEvent(allRecords, abi, extrinsicIndex, 'WithdrawNFT');
          await handleCancelCall(api, admin, withdrawNFTEvent);
        }

        // Withdraw: 0x410fcc9d020000000000000000407a10f35a00000000000000000000
        if (data.startsWith("0x410fcc9d")) {
          const withdrawQuoteUnusedEvent = findMatcherEvent(allRecords, abi, extrinsicIndex, 'WithdrawQuoteUnused');
          await handleWithdrawCall(withdrawQuoteUnusedEvent);
        }

      }
      catch (e) {
        log(e, "ERROR");
      }
    }
  }
}

async function handleBuyCall(api, admin, withdrawNFTEvent, withdrawQuoteMatchedEvent) {
  if(!withdrawNFTEvent) {
    throw `Couldn't find WithdrawNFT event in Buy call`;
  }
  if(!withdrawQuoteMatchedEvent) {
    throw `Couldn't find WithdrawQuoteMatched event in Buy call`;
  }

  log(`======== Buy call`);

  // WithdrawNFT
  log(`--- Event 1: ${withdrawNFTEvent.event.identifier}`);
  const buyerAddress = withdrawNFTEvent.args[0].toString();
  log(`NFT Buyer address: ${buyerAddress}`);
  const collectionId = withdrawNFTEvent.args[1];
  log(`collectionId = ${collectionId.toString()}`);
  const tokenId = withdrawNFTEvent.args[2];
  log(`tokenId = ${tokenId.toString()}`);

  // WithdrawQuoteMatched
  log(`--- Event 2: ${withdrawQuoteMatchedEvent.event.identifier}`);
  const sellerAddress = withdrawQuoteMatchedEvent.args[0].toString();
  log(`NFT Seller address: ${sellerAddress}`);
  const quoteId = withdrawQuoteMatchedEvent.args[1].toNumber();
  const price = withdrawQuoteMatchedEvent.args[2].toString();
  log(`Price: ${quoteId} - ${price.toString()}`);

  // Update offer to done (status = 3 = Traded)
  const id = await updateOffer(collectionId.toString(), tokenId.toString(), 3);

  // Record trade
  await addTrade(id, buyerAddress);

  // Record outgoing quote tx
  await addOutgoingQuoteTransaction(quoteId, price.toString(), sellerAddress, 1);

  // Execute NFT transfer to buyer
  await sendNftTxAsync(api, admin, buyerAddress.toString(), collectionId, tokenId);

}

async function handleCancelCall(api, admin, event) {
  if(!event) {
    throw `Couldn't find WithdrawNFT event in Cancel call`;
  }

  log(`======== Cancel call`);

  // WithdrawNFT
  log(`--- Event 1: ${event.event.identifier}`);
  const sellerAddress = event.args[0];
  log(`NFT Seller address: ${sellerAddress.toString()}`);
  const collectionId = event.args[1];
  log(`collectionId = ${collectionId.toString()}`);
  const tokenId = event.args[2];
  log(`tokenId = ${tokenId.toString()}`);


  // Update offer to calceled (status = 2 = Canceled)
  await updateOffer(collectionId.toString(), tokenId.toString(), 2);

  // Execute NFT transfer back to seller
  await sendNftTxAsync(api, admin, sellerAddress.toString(), collectionId, tokenId);
}

async function handleWithdrawCall(event) {
  if(!event) {
    throw `Couldn't find WithdrawQuoteUnused event in Withdraw call`;
  }

  log(`======== Withdraw call`);

  // WithdrawQuoteUnused
  log(`--- Event 1: ${event.event.identifier}`);
  const withdrawerAddress = event.args[0];
  log(`Withdrawing address: ${withdrawerAddress.toString()}`);
  const quoteId = parseInt(event.args[1].toString());
  const price = event.args[2].toString();
  log(`Price: ${quoteId} - ${price.toString()}`);

  // Record outgoing quote tx
  await addOutgoingQuoteTransaction(quoteId, price.toString(), withdrawerAddress, 0);

}

function findMatcherEvent(allRecords, abi, extrinsicIndex, eventName) {
  return allRecords
    .filter(r =>
      r.event.method.toString() === 'ContractEmitted'
      && r.phase.isApplyExtrinsic
      && r.phase.asApplyExtrinsic.toNumber() === extrinsicIndex
      && r.event.data[0]
      && r.event.data[0].toString() === config.marketContractAddress
    )
    .map(r => abi.decodeEvent(r.event.data[1]))
    .filter(r => r.event.identifier === eventName)[0];
}

async function subscribeToBlocks(api) {
  await api.rpc.chain.subscribeNewHeads((header) => {
    bestBlockNumber = header.number;
    cancelDelay();
  });
}

async function addWhiteList({
  api,
  userAddress,
  sender,
  marketContractAddress
}) {
  if (!config.whiteList) return;

  const whiteListedBefore = (await api.query.nft.contractWhiteList(marketContractAddress, userAddress)).toJSON();
  if (!whiteListedBefore) {
    try {
      const addTx = api.tx.nft.addToContractWhiteList(marketContractAddress, userAddress);
      await sendTransactionAsync(sender, addTx);
    } catch(error) {
      log(`Failed add to while list. Address: ${userAddress}`);
    }
  }
}

async function handleUnique() {

  const api = await connect(config);
  const keyring = new Keyring({ type: 'sr25519' });
  const admin = keyring.addFromUri(config.adminSeed);
  adminAddress = admin.address.toString();
  log(`Escrow admin address: ${adminAddress}`);

  // await scanNftBlock(api, admin, 415720);
  // return;

  await subscribeToBlocks(api);

  // Work indefinitely
  while (true) {

    // 1. Catch up with blocks
    while (true) {
      // Get last processed block
      let blockNum = parseInt(await getLastHandledUniqueBlock(api)) + 1;

      try {
        if (blockNum <= bestBlockNumber) {
          await addHandledUniqueBlock(blockNum);

          // Handle NFT Deposits (by analysing block transactions)
          await scanNftBlock(api, admin, blockNum);
        } else break;

      } catch (ex) {
        log(ex);
        if (!ex.toString().includes("State already discarded"))
          await delay(1000);
      }
    }

    // Handle queued NFT deposits
    let deposit = false;
    do {
      deposit = false;
      const nftTx = await getIncomingNFTTransaction();
      if (nftTx.id.length > 0) {
        deposit = true;

        try {
          await registerNftDepositAsync(api, admin, nftTx.sender, nftTx.collectionId, nftTx.tokenId);
          await setIncomingNftTransactionStatus(nftTx.id, 1);
          log(`NFT deposit from ${nftTx.sender} id (${nftTx.collectionId}, ${nftTx.tokenId})`, "REGISTERED");
        } catch (e) {
          log(`NFT deposit from ${nftTx.sender} id (${nftTx.collectionId}, ${nftTx.tokenId})`, "FAILED TO REGISTER");
          await delay(6000);
        }
      }
    } while (deposit);

    // Handle queued KSM deposits
    do {
      deposit = false;
      const ksmTx = await getIncomingKusamaTransaction();
      if (ksmTx.id.length > 0) {
        deposit = true;

        try {

          const paraments = {
            api,
            userAddress: ksmTx.sender,
            sender: admin,
            marketContractAddress: config.marketContractAddress
          };
          // Add sender to contract white list
          await addWhiteList(paraments);

          await registerQuoteDepositAsync({api, sender: admin, depositorAddress: ksmTx.sender, amount: ksmTx.amount});
          await setIncomingKusamaTransactionStatus(ksmTx.id, 1);
          log(`Quote deposit from ${ksmTx.sender} amount ${ksmTx.amount.toString()}`, "REGISTERED");
        } catch (e) {
          log(`Quote deposit from ${ksmTx.sender} amount ${ksmTx.amount.toString()}`, "FAILED TO REGISTER");
          await delay(6000);
        }
      }

    } while (deposit);

    await delay(6000);
  }

}

async function migrateDb(){
  const conn = await getDbConnection();
  const migrationSql = fs.readFileSync('migration-script.sql').toString();
  await conn.query(migrationSql);
}

async function migrated(migrationId) {
  try {
    const conn = await getDbConnection();
    const migrationSql = `SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = $1`;
    const res = await conn.query(migrationSql, [migrationId]);
    return res.rows.length > 0;
  } catch (error) {
    // 42P01 = table does not exist
    if(error.code === '42P01') {
      return false;
    }

    throw error;
  }
}

async function setMetadataForAllOffers() {
  const conn = await getDbConnection();
  const offers = await conn.query(`SELECT "Id", "CreationDate", "CollectionId", "TokenId"	FROM public."Offer";`)
  const api = await connect(config);
  for(let offer of offers.rows) {
    const [collection, token] = await Promise.all([api.query.nft.collectionById(+offer.CollectionId), api.query.nft.nftItemList(+offer.CollectionId, +offer.TokenId)]);
    const metadata = decodeTokenMeta(collection, token);
    if(metadata) {
      await conn.query(`UPDATE public."Offer"
      SET "Metadata"=$1
      WHERE "Id"=$2;`, [metadata, offer.Id]);
    }
  }
}

async function createTestOffers() {
  const api = await connect(config);
  const keyring = new Keyring({ type: 'sr25519' });
  const admin = keyring.addFromUri('//Bob');
  adminAddress = admin.address.toString();
  for(let i = 1; i < 200; i++) {
    const [collection, token] = await Promise.all([api.query.nft.collectionById(25), api.query.nft.nftItemList(25, i)]);
    const metadata = decodeTokenMeta(collection, token);
    const textSearchKeywords = decodeSearchKeywords(collection, token, i.toString());
    if(metadata) {
      await addOffer(adminAddress, 25, i, 2, '100000000000', metadata, textSearchKeywords);
    }
  }
  for(let i = 1; i < 200; i++) {
    const [collection, token] = await Promise.all([api.query.nft.collectionById(23), api.query.nft.nftItemList(23, i)]);
    const metadata = decodeTokenMeta(collection, token);
    const textSearchKeywords = decodeSearchKeywords(collection, token, i.toString());
    if(metadata) {
      await addOffer(adminAddress, 23, i, 2, '100000000000', metadata, textSearchKeywords);
    }
  }
  for(let i = 1; i < 200; i++) {
    const [collection, token] = await Promise.all([api.query.nft.collectionById(112), api.query.nft.nftItemList(112, i)]);
    const metadata = decodeTokenMeta(collection, token);
    const textSearchKeywords = decodeSearchKeywords(collection, token, i.toString());
    if(metadata) {
      await addOffer(adminAddress, 112, i, 2, '100000000000', metadata, textSearchKeywords);
    }
  }
}

async function setTextSearchForAllOffers() {
  const conn = await getDbConnection();
  const offers = await conn.query(`SELECT DISTINCT "CollectionId", "TokenId" FROM public."Offer";`)
  const api = await connect(config);
  for(let offer of offers.rows) {
    const [collection, token] = await Promise.all([api.query.nft.collectionById(+offer.CollectionId), api.query.nft.nftItemList(+offer.CollectionId, +offer.TokenId)]);
    const textSearchKeywords = decodeSearchKeywords(collection, token, offer.TokenId.toString());
    await saveSearchKeywords(conn, +offer.CollectionId, +offer.TokenId, textSearchKeywords);
  }
}

async function truncateTextSearch() {
  const conn = await getDbConnection();
  await conn.query(`TRUNCATE public."TokenTextSearch";`)
}

async function main() {
  log(`config.wsEndpoint: ${config.marketContractAddress}`);
  log(`config.marketContractAddress: ${config.marketContractAddress}`);
  const [isMetadataMigrated, isTextSearchMigrated, isAddTokenPrefixAndIdMigrated, isFixedTokensSearchIndexing] =
    await Promise.all([migrated('20210722091927_JsonMetadata'), migrated('20210802081707_TokensTextSearch'), migrated('20210805043620_AddTokenPrefixAndIdToSearch'), migrated('20210806043509_FixedTokensSearchIndexing')]);
  await migrateDb();

  if(!isMetadataMigrated)
  {
    await setMetadataForAllOffers();
  }

  if(!isTextSearchMigrated || !isAddTokenPrefixAndIdMigrated || !isFixedTokensSearchIndexing)
  {
    await truncateTextSearch();
    await setTextSearchForAllOffers();
  }

  await handleUnique();
}

main().catch(console.error).finally(() => process.exit());
