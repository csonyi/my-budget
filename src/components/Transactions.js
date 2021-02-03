import React from "react";

import { Route, Switch } from "react-router-dom";

import { Grid } from "@material-ui/core";

import { TransactionsDayView, TransactionsWeekView } from "./TransactionViews";

export default function Transactions(props) {
  const viewProps = {
    transactions: props.transactions,
    addTransaction: props.addTransaction,
    updateTransaction: props.updateTransaction,
    removeTransaction: props.removeTransaction,
    accounts: props.accounts,
  };
  return (
    <Grid container direction="row" spacing={1}>
      <Switch>
        <Route path="/transactions/day/:date">
          <TransactionsDayView {...viewProps} />
        </Route>
        <Route path="/transactions/week/:weekNumber">
          <TransactionsWeekView {...viewProps} />
        </Route>
      </Switch>
    </Grid>
  );
}
