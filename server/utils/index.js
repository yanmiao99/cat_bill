const Decimal = require('decimal.js');

function formatNumber(input) {
  const num = new Decimal(input);
  return num.toFixed(2);
}

module.exports = {
  formatNumber,
}
