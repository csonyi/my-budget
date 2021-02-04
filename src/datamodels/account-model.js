import { v1 as uuid, NIL as defaultId } from "uuid";

export default class AccountData {
  constructor(
    name = "Wallet",
    initialBalance = 0,
    currencyId = "HUF",
    id = uuid()
  ) {
    this.name = name;
    this.balance = initialBalance;
    this.currencyId = currencyId;
    this.id = id;
  }

  static defaultAccountData = new AccountData("Wallet", 0, "HUF", defaultId);

  static fromAccountObject(account) {
    return new AccountData(
      account.name,
      account.balance,
      account.currencyId,
      account.id
    );
  }

  // TODO: more readable parameters
  editAccount(changedValues) {
    for (const [key, value] of Object.entries(changedValues)) {
      this[key] = value;
    }
  }
}
