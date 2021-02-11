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

import { LocalstorageService as LS } from "./services/localstorage-service";
import CurrencyHandler from "./datamodels/currency-model";

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
    const locallySavedState = LS.load(localStorageKey);
    this.state = locallySavedState || defaultState;
    this.state.currencyHandler = new CurrencyHandler();
    this.state.currencyHandler.fetchAll(() => {
      console.log("ERROR");
    });
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
      LS.save(localStorageKey, this.state);
    });
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
    editedAccount.editAccount({
      name: account.name,
      balance: parseFloat(account.balance) || 0,
      currencyId: account.currencyId,
    });
    this.updateState({
      accounts: this.state.accounts.map((currentAccount) =>
        currentAccount.id === account.id ? editedAccount : currentAccount
      ),
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
    this.updateState({
      transactions: this.state.transactions.map((currentTransaction) =>
        currentTransaction.id === transaction.id
          ? transaction
          : currentTransaction
      ),
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

  toggleTransactionCommited = (transaction) => {
    const account = this.state.accounts.find(
      (account) => account.id === transaction.accountId
    );
    let transactionValue;
    if (transaction.currencyId === account.currencyId) {
      transactionValue = transaction.amount;
      if (transaction.completed) {
        account.changeBalanceBy(transactionValue);
      } else {
        account.changeBalanceBy(-transactionValue);
      }
      this.updateAccount(account);
    } else {
      this.state.currencyHandler
        .convert(transaction.currencyId, account.currencyId, transaction.amount)
        .then((convertedValue) => {
          transactionValue = convertedValue;
        })
        .then(() => {
          if (transaction.completed) {
            account.changeBalanceBy(transactionValue);
          } else {
            account.changeBalanceBy(-transactionValue);
          }
          console.log(transactionValue);
          this.updateAccount(account);
        });
    }
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
                currencyHandler={this.state.currencyHandler}
              />
            </Route>
            <Route path="/transactions">
              <Transactions
                transactions={this.state.transactions}
                accounts={this.state.accounts}
                addTransaction={this.addTransaction}
                updateTransaction={this.updateTransaction}
                removeTransaction={this.removeTransaction}
                toggleTransactionCommited={this.toggleTransactionCommited}
                currencyHandler={this.state.currencyHandler}
              />
            </Route>
            <Route>
              <DashBoard
                accounts={this.state.accounts}
                currencyHandler={this.state.currencyHandler}
                transactions={this.state.transactions}
              />
            </Route>
          </Switch>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(MyBudget);
