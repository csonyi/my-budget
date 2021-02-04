import React from "react";
import { Route, Switch } from "react-router-dom";

import { withStyles } from "@material-ui/core";
import Accounts from "./components/Accounts";
import DashBoard from "./components/DashBoard";
import MyAppBar from "./components/MyAppbar";
import MyDrawer from "./components/MyDrawer";
import Transactions from "./components/Transactions";

import AccountData from "./datamodels/account-model";
import TransactionData from "./datamodels/transaction-model";

const localStorageKey = "my-budget-state";
const defaultState = {
  accounts: [AccountData.defaultAccountData],
  transactions: [
    new TransactionData(5000, "HUF", "00000000-0000-0000-0000-000000000000"),
  ],
  drawerOpen: false,
};

const styles = (theme) => ({
  content: {
    padding: theme.spacing(1),
    [theme.breakpoints.only("xs")]: {
      marginLeft: theme.spacing(7),
      marginTop: theme.spacing(7),
    },
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(9),
      marginTop: theme.spacing(8),
    },
  },
});

class MyBudget extends React.Component {
  constructor(props) {
    super(props);
    const locallySavedState = JSON.parse(localStorage.getItem(localStorageKey));
    this.state = locallySavedState || defaultState;
    if (locallySavedState !== null) {
      const locallySavedAccounts = locallySavedState.accounts;
      const locallySavedTransactions = locallySavedState.transactions;
      this.state.accounts = locallySavedAccounts.map((account) =>
        AccountData.fromAccountObject(account)
      );
      this.state.transactions = locallySavedTransactions.map((transaction) =>
        TransactionData.fromTransactionObject(transaction)
      );
    }
  }

  updateState(newState) {
    this.setState(newState, () => {
      this.saveStateLocally();
    });
  }

  saveStateLocally() {
    localStorage.setItem(localStorageKey, JSON.stringify(this.state));
  }

  addAccount = (name, initialBalance, currencyId) => {
    this.updateState({
      accounts: [
        ...this.state.accounts,
        new AccountData(name, parseFloat(initialBalance), currencyId),
      ],
    });
  };

  updateAccount = (account) => {
    let editedAccount = this.state.accounts.find(
      (acc) => acc.id === account.id
    );
    const editedAccountIndex = this.state.accounts.indexOf(editedAccount);
    editedAccount.editAccount({
      name: account.name,
      balance: parseFloat(account.balance) || 0,
      currencyId: account.currencyId,
    });
    const firstPart = this.state.accounts.slice(0, editedAccountIndex);
    const secondPart = this.state.accounts.slice(editedAccountIndex + 1);
    this.updateState({
      accounts: [...firstPart, editedAccount, ...secondPart],
    });
  };

  removeAccount = (uuid) => {
    const filteredAccounts = this.state.accounts.filter(
      (account) => account.id !== uuid
    );
    this.updateState({
      accounts: filteredAccounts,
    });
  };

  addTransaction = (amount, currencyId, accountId, date) => {
    const transactions = this.state.transactions;
    transactions.push(new TransactionData(amount, currencyId, accountId, date));
    this.updateState({
      transactions: transactions,
    });
  };

  updateTransaction = (transaction) => {
    let editedTransaction = this.state.transactions.find(
      (currentTransaction) => currentTransaction.id === transaction.id
    );
    let editedTransactionIndex = this.state.transactions.indexOf(
      editedTransaction
    );
    editedTransaction.editTransaction(transaction);
    const firstPart = this.state.transactions.slice(0, editedTransactionIndex);
    const secondPart = this.state.transactions.slice(
      editedTransactionIndex + 1
    );
    this.updateState({
      transactions: [...firstPart, editedTransaction, ...secondPart],
    });
  };

  removeTransaction = (uuid) => {
    const filteredTransactions = this.state.transactions.filter(
      (transaction) => transaction.id !== uuid
    );
    this.updateState({
      transactions: filteredTransactions,
    });
  };

  onDrawerToggle = () => {
    this.setState((state) => ({
      drawerOpen: !state.drawerOpen,
    }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <MyAppBar
          onDrawerToggle={this.onDrawerToggle}
          isDrawerOpen={this.state.drawerOpen}
        />
        <MyDrawer
          onDrawerToggle={this.onDrawerToggle}
          isDrawerOpen={this.state.drawerOpen}
        />
        <main className={classes.content}>
          <Switch>
            <Route path="/accounts">
              <Accounts
                accounts={this.state.accounts}
                addAccount={this.addAccount}
                removeAccount={this.removeAccount}
                updateAccount={this.updateAccount}
              />
            </Route>
            <Route path="/transactions">
              <Transactions
                transactions={this.state.transactions}
                accounts={this.state.accounts}
                addTransaction={this.addTransaction}
                updateTransaction={this.updateTransaction}
                removeTransaction={this.removeTransaction}
              />
            </Route>
            <Route component={DashBoard} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(MyBudget);
