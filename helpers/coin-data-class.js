class SingleCoinData {
  constructor(marketObj, chart) {
    this.id = marketObj.id;
    this.symbol = marketObj.symbol;
    this.name = marketObj.name;
    this.description = marketObj.description;
    this.images = marketObj.image;
    this.genesis_date = marketObj.genesis_date;
    this.current_price = marketObj.current_price;
    this.ath = marketObj.market_data.ath.usd;
    this.market_cap = marketObj.market_data.market_cap.usd;
    this.total_volume = marketObj.market_data.total_volume.usd;
    this.price_change_24h = marketObj.market_data.price_change_percentage_24h_in_currency.usd;
    this.circulating_supply = marketObj.market_data.circulating_supply;
    this.max_supply = marketObj.market_data.max_supply;
    this.chart = chart.prices.map(item => {
      return {
        date: new Date(item[0]),
        price: item[1],
      }
    })
  }
}

module.exports = SingleCoinData