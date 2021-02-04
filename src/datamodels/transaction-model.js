import { v1 as uuid } from "uuid";

export default class TransactionData {
  constructor(amount, currency, accountId, completed, date = Date.now()) {
    this.id = uuid();
    this.amount = amount;
    this.currency = currency;
    this.accountId = accountId;
    this.completed = completed;
    this.date = date;
  }
  // TODO: more readable parameters
  editTransaction(changedValues) {
    for (const [key, value] of Object.entries(changedValues)) {
      this[key] = value;
    }
  }
}
