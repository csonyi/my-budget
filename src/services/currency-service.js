import { LocalstorageService as LS } from "./localstorage-service";

const apiBaseUrl = "https://free.currconv.com/api/v7/";
const apiKey = "e234961b21c160643223";

const localStorageCurrencyKey = "local-currencies";
const localStorageRateKey = "local-rates";

export default class CurrencyService {
  static async getCurrencies(errorHandler) {
    if (LS.exists(localStorageCurrencyKey)) {
      return LS.load(localStorageCurrencyKey);
    }

    console.log("Fetching currencies...");
    const url = apiBaseUrl + "currencies?apiKey=" + apiKey;
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error while fetching currencies!");
      errorHandler();
    }
    const data = await response.json();
    LS.save(localStorageCurrencyKey, data.results);
    return data.results;
  }

  static async getRate(fromCurrency, toCurrency, errorhandler = () => {}) {
    let localRates = LS.load(localStorageRateKey);
    if (localRates !== null) {
      if (
        localRates.hasOwnProperty(fromCurrency) &&
        localRates[fromCurrency].hasOwnProperty(toCurrency)
      ) {
        return localRates[fromCurrency][toCurrency];
      }
    }
    console.log(`Fetching rate: ${fromCurrency} -> ${toCurrency}`);
    const query = [
      encodeURIComponent(fromCurrency) + "_" + encodeURIComponent(toCurrency),
      encodeURIComponent(toCurrency) + "_" + encodeURIComponent(fromCurrency),
    ];
    const url =
      apiBaseUrl +
      "convert?q=" +
      query.join(",") +
      "&compact=ultra&apiKey=" +
      apiKey;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.ok) {
      errorhandler();
    }

    localRates = {
      ...localRates,
      [fromCurrency]: {
        ...localRates[fromCurrency],
        [toCurrency]: data[query[0]],
      },
      [toCurrency]: {
        ...localRates[toCurrency],
        [fromCurrency]: data[query[1]],
      },
    };
    LS.save(localStorageRateKey, localRates);
    return data[query[0]];
  }
}

export { CurrencyService };
