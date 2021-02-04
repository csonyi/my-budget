import { v1 as uuid, NIL as defaultId } from "uuid";

export default class AccountData {
  constructor(
    name = "Wallet",
    initialBalance = 0,
    currency = "HUF",
    id = uuid()
  ) {
    this.name = name;
    this.balance = initialBalance;
    this.currency = currency;
    this.symbol = AccountData.getCurrencySymbol(currency);
    this.id = id;
  }

  static currencySymbols = {
    HUF: "Ft",
    EUR: "€",
    USD: "$",
    get: function (currencyName) {
      return this.hasOwnProperty(currencyName)
        ? this[currencyName]
        : currencyName;
    },
  };

  static defaultAccountData = new AccountData("Wallet", 0, "HUF", defaultId);

  static getCurrencySymbol(currency) {
    return AccountData.currencySymbols.get(currency);
  }

  // TODO: more readable parameters
  editAccount(changedValues) {
    for (const [key, value] of Object.entries(changedValues)) {
      this[key] = value;
    }
  }

  set newCurrency(currency) {
    this.currency = currency;
    this.symbol = AccountData.getCurrencySymbol(currency);
  }

  set newData(account) {
    this.name = account.name;
    this.balance = account.balance;
    this.newCurrency = account.currency;
  }
}
