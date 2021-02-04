const apiBaseUrl = "https://free.currconv.com/api/v7/";
const apiKey = "e234961b21c160643223";
const localStorageCurrencyKey = "local-currencies";

export default class CurrencyHandler {
  static instance = new CurrencyHandler();
  constructor() {
    this.currencies = {};
    this.fetchAllCurrencies();
  }

  static async getRate(fromCurrency, toCurrency) {
    const query =
      encodeURIComponent(fromCurrency) +
      "_" +
      encodeURIComponent(toCurrency) +
      "," +
      encodeURIComponent(toCurrency) +
      "_" +
      encodeURIComponent(fromCurrency);
    const url =
      apiBaseUrl + "convert?q=" + query + "&compact=ultra&apiKey=" + apiKey;

    const response = await fetch(url);
    return await response.json();
  }

  async fetchAllCurrencies() {
    const localCurrencies = localStorage.getItem(localStorageCurrencyKey);
    if (localCurrencies == null) {
      console.log("Fetching currencies...");
      const url = apiBaseUrl + "currencies?apiKey=" + apiKey;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      this.currencies = data.results;
      localStorage.setItem(
        localStorageCurrencyKey,
        JSON.stringify(this.currencies)
      );
    } else {
      this.currencies = JSON.parse(localCurrencies);
    }
  }

  getCurrency(currencyId) {
    return this.currencies[currencyId];
  }

  getSymbol(currencyId) {
    // console.log(currencyId);
    const currencySymbol = this.currencies[currencyId].currencySymbol;
    return currencySymbol ? currencySymbol : currencyId;
  }

  getName(currencyId) {
    return this.currencies[currencyId].currencyName;
  }

  toString() {
    return JSON.stringify(this);
  }
}
