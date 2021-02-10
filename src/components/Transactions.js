import React from "react";
import PropTypes from "prop-types";

import { Route, Switch } from "react-router-dom";

import { Grid } from "@material-ui/core";

import { TransactionsDayView, TransactionsWeekView } from "./TransactionViews";
import TransactionData from "../datamodels/transaction-model";
import CurrencyHandler from "../datamodels/currency-model";
import AccountData from "../datamodels/account-model";

export default function Transactions(props) {
  const viewProps = {
    transactions: props.transactions,
    addTransaction: props.addTransaction,
    updateTransaction: props.updateTransaction,
    removeTransaction: props.removeTransaction,
    accounts: props.accounts,
    currencyHandler: props.currencyHandler,
    toggleTransactionCommited: props.toggleTransactionCommited,
  };
  return (
    <Grid container direction="row" spacing={1}>
      <Switch>
        <Route path="/transactions/week/:weekNumber">
          <TransactionsWeekView {...viewProps} />
        </Route>
        <Route path="/transactions">
          <TransactionsDayView {...viewProps} />
        </Route>
      </Switch>
    </Grid>
  );
}

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(TransactionData),
  accounts: PropTypes.arrayOf(AccountData),
  addTransaction: PropTypes.func,
  updateTransaction: PropTypes.func,
  removeTransaction: PropTypes.func,
  toggleTransactionCommited: PropTypes.func,
  currencyHandler: PropTypes.instanceOf(CurrencyHandler),
};
