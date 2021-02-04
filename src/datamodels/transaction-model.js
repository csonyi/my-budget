import { v1 as uuid } from "uuid";

export default class TransactionData {
  constructor(
    amount,
    currencyId,
    accountId,
    completed = false,
    date = Date.now(),
    id = uuid()
  ) {
    this.amount = amount;
    this.currencyId = currencyId;
    this.accountId = accountId;
    this.completed = completed;
    this.date = date;
    this.id = id;
  }

  static fromTransactionObject(transaction) {
    return new TransactionData(
      transaction.amount,
      transaction.currencyId,
      transaction.accountId,
      transaction.completed,
      transaction.date,
      transaction.id
    );
  }

  // TODO: more readable parameters
  editTransaction(changedValues) {
    for (const [key, value] of Object.entries(changedValues)) {
      this[key] = value;
    }
  }
}
