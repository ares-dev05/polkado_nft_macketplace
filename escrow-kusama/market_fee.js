const BigNumber = require('./big_number');
const FEE = new BigNumber(0.1);
const totalToPriceRatio = FEE.plus(1);

function subtractMarketFeeFromTotal(priceWithFee, roundingMode) {
  return priceWithFee.dividedBy(totalToPriceRatio).integerValue(roundingMode);
}

function addMarketFeeToPrice(priceBN, roundingMode) {
  return priceBN.multipliedBy(totalToPriceRatio).integerValue(roundingMode);
}

module.exports = {
  subtractMarketFeeFromTotal,
  addMarketFeeToPrice
}