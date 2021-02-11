import { CurrencyService as CS } from "../services/currency-service";

export default class CurrencyHandler {
  constructor() {
    this.currencies = {
      HUF: {
        currencyName: "Hungarian Forint",
        currencySymbol: "Ft",
        id: "HUF",
      },
      EUR: {
        currencyName: "Euro",
        currencySymbol: "€",
        id: "EUR",
      },
    };
  }

  async fetchAll(errorHandler) {
    const currencies = await CS.getCurrencies(errorHandler);
    this.currencies = currencies;
  }

  async convert(from, to, amount) {
    const rate = await CS.getRate(from, to);
    return amount * rate;
  }

  getCurrency(currencyId) {
    console.log(currencyId, this.currencies);
    return this.currencies[currencyId];
  }

  getSymbol(currencyId) {
    // console.log(this.currencies);
    const currency = this.currencies[currencyId];
    return currency ? currency.currencySymbol : currencyId;
  }

  getName(currencyId) {
    return this.currencies[currencyId]
      ? this.currencies[currencyId].currencyName
      : currencyId;
  }

  formatCurrency(n, currencyId) {
    const truncatedNumber =
      Math.round((parseFloat(n) + Number.EPSILON) * 10000) / 10000;
    return `${new Intl.NumberFormat("hu-HU").format(
      truncatedNumber
    )} ${this.getSymbol(currencyId)}`;
  }
}
