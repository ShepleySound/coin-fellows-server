class CoinMarketData {
  constructor(marketObj) {
    this.id = marketObj.id;
    this.name = marketObj.name;
    this.symbol = marketObj.symbol;
    this.image = marketObj.image;
    this.rank = marketObj.market_cap_rank;
    this.percentage_change_24h = marketObj.price_change_percentage_24h;
    this.marketCap = marketObj.market_cap;
    this.current_price = marketObj.current_price;
  }
}

module.exports = CoinMarketData