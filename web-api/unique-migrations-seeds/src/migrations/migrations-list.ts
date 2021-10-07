import { initial } from "./20210121093304_Initial";
import { kusamaVault } from "./20210210063040_KusamaVault";
import { uniqueScanner } from "./20210224065850_UniqueScanner";
import { registeringNftDeposit } from "./20210303090905_RegisteringNftDeposit";
import { dataToProcessRefactoring } from "./20210310100907_DataToProcessRefactoring";
import { kusamaOutgoingTransactions } from "./20210310113953_KusamaOutgoingTransactions";
import { addedQuoteIdToKusamaIncome } from "./20210311060602_AddedQuoteIdToKusamaIncome";
import { renamesAndMissingFields } from "./20210311090819_RenamesAndMissingFields";
import { renamesKusamaToQuote } from "./20210311094419_RenamesKusamaToQuote";
import { renamedTablesToSingular } from "./20210311095148_RenamedTablesToSingular";
import { renamedIncomeToIncoming } from "./20210311100100_RenamedIncomeToIncoming";
import { withdrawType } from "./20210312022703_WithdrawType";
import { onHold } from "./20210705034532_OnHold";
import { priceFilter } from "./20210715081147_PriceFilter";
import { jsonMetadata } from "./20210722091927_JsonMetadata";
import { tokensTextSearch } from "./20210802081707_TokensTextSearch";
import { addTokenPrefixAndIdToSearch } from "./20210805043620_AddTokenPrefixAndIdToSearch";
import { fixedTokensSearchIndexing } from "./20210806043509_FixedTokensSearchIndexing";
import { MarketplaceMigration } from "./marketplace-migration";

const migrationsList: MarketplaceMigration[] = [
  initial,
  kusamaVault,
  uniqueScanner,
  registeringNftDeposit,
  dataToProcessRefactoring,
  kusamaOutgoingTransactions,
  addedQuoteIdToKusamaIncome,
  renamesAndMissingFields,
  renamesKusamaToQuote,
  renamedTablesToSingular,
  renamedIncomeToIncoming,
  withdrawType,
  onHold,
  priceFilter,
  jsonMetadata,
  tokensTextSearch,
  addTokenPrefixAndIdToSearch,
  fixedTokensSearchIndexing
].sort((a, b) => a.name.localeCompare(b.name));

export {migrationsList};