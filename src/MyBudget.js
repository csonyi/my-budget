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
import CurrencyHandler from "./datamodels/currency-model";

const localStorageKey = "my-budget-state";
const defaultState = {
  accounts: [AccountData.defaultAccountData],
  balances: [
    AccountData.defaultAccountData.balance +
      " " +
      AccountData.defaultAccountData.symbol,
  ],
  transactions: [
    new TransactionData(5000, "HUF", "00000000-0000-0000-0000-000000000000"),
  ],
  drawerOpen: false,
};
const currencyHandler = new CurrencyHandler();

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
  }

  // TODO: Move balance to its own component
  updateState(newState) {
    this.setState(newState, () => {
      localStorage.setItem(localStorageKey, JSON.stringify(this.state));
      this.setState((state) => ({
        balances: state.accounts
          .reduce((currencies, currentAcc) => {
            if (currencies.indexOf(currentAcc.currency) === -1) {
              currencies.push(currentAcc.currency);
            }
            return currencies;
          }, [])
          .map(
            (currency) =>
              state.accounts.reduce(
                (sum, currentAcc) =>
                  currentAcc.currency === currency
                    ? sum + currentAcc.balance
                    : sum,
                0
              ) +
              " " +
              AccountData.getCurrencySymbol(currency)
          ),
      }));
    });
  }

  addAccount = (name, initialBalance, currency) => {
    this.updateState({
      accounts: [
        ...this.state.accounts,
        new AccountData(name, parseFloat(initialBalance), currency),
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
      currency: account.currency,
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

  addTransaction = (amount, currency, accountId, date) => {
    const transactions = this.state.transactions;
    transactions.push(new TransactionData(amount, currency, accountId, date));
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
    editedTransaction.editedTransaction(transaction);
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
      transaction: filteredTransactions,
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
          balances={this.state.balances}
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
