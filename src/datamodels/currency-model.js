const apiBaseUrl = "https://free.currconv.com/api/v7/";
const apiKey = "e234961b21c160643223";

export default class CurrencyHandler {
  constructor() {
    this.allCurrencies = {};
    this.fetchAllCurrencies().then((results) => {
      this.allCurrencies = results;
    });
  }

  async fetchAllCurrencies() {
    const url = apiBaseUrl + "currencies?apiKey=" + apiKey;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  }

  async getRate(fromCurrency, toCurrency) {
    const query =
      encodeURIComponent(fromCurrency) + "_" + encodeURIComponent(toCurrency);
    const url =
      apiBaseUrl + "convert?q=" + query + "&compact=ultra&apiKey=" + apiKey;

    const response = await fetch(url);
    return await response.json();
  }
}
