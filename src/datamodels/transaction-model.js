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
    this.amount = parseFloat(amount);
    this.accountId = accountId;
    this.currencyId = currencyId;
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

  editTransaction(changedValuesObject) {
    for (const [key, value] of Object.entries(changedValuesObject)) {
      this[key] = value;
    }
  }
}
