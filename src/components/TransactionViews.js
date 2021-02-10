import React from "react";
import PropTypes from "prop-types";

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import clsx from "clsx";

import AccountSelector from "./AccountSelector";
import CurrencySelector from "./CurrencySelector";
import AccountData from "../datamodels/account-model";
import TransactionData from "../datamodels/transaction-model";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  income: {
    backgroundColor: theme.palette.income.light,
  },
  expense: {
    backgroundColor: theme.palette.expense.light,
  },
  newTransaction: {
    display: "flex",
    flexDirection: "column",
  },
  transaction: {
    minWidth: "320px",
  },
  inputField: {
    maxWidth: "250px",
  },
}));

const TransactionLabel = (props) => {
  const { editMode, amount, transaction, currencyHandler } = props;
  const sign = transaction.amount >= 0 ? "+" : "";
  const account = AccountData.getAccountById(
    transaction.accountId,
    props.accounts
  );
  const conversionNeeded = transaction.currencyId !== account.currencyId;
  const amountText =
    sign +
    currencyHandler.formatCurrency(transaction.amount, transaction.currencyId);
  const [convertedAmount, setConvertedAmount] = React.useState("");
  React.useEffect(() => {
    if (conversionNeeded) {
      currencyHandler
        .convert(transaction.currencyId, account.currencyId, amount)
        .then((data) => {
          setConvertedAmount(data);
        });
    }
  });
  const conversionText = conversionNeeded
    ? currencyHandler.formatCurrency(convertedAmount, transaction.currencyId)
    : "";
  return editMode ? (
    <TextField
      type="number"
      onChange={props.onChange}
      onClick={(e) => e.stopPropagation()}
      value={amount}
    />
  ) : (
    <Grid container direction="row" spacing={1}>
      <Grid item>
        <Typography>{amountText}</Typography>
      </Grid>
      {conversionNeeded ? (
        <Grid item>
          <Typography variant="caption">{conversionText}</Typography>
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};

export const Transaction = (props) => {
  let transaction = props.transaction;
  const [editMode, setEditMode] = React.useState(false);
  const [checked, setChecked] = React.useState(transaction.completed);
  const [accountId, setAccountId] = React.useState(transaction.accountId);
  const [currencyId, setCurrencyId] = React.useState(transaction.currencyId);
  const [amount, setAmount] = React.useState(transaction.amount);
  const classes = useStyles();

  const handleEdit = (e) => {
    setEditMode(!editMode);
    if (editMode) {
      props.updateTransaction(transaction);
    }
  };

  const handleRemove = () => {
    props.removeTransaction(transaction.id);
  };

  const handleCheck = (e) => {
    e.stopPropagation();
    props.transaction.completed = !checked;
    setChecked(!checked);
    props.updateTransaction(transaction);
    props.toggleTransactionCommited(props.transaction);
  };

  const handleAccountChange = (e) => {
    setAccountId(e.target.value);
    transaction.accountId = e.target.value;
    props.updateTransaction(transaction);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    transaction.amount = e.target.value;
    props.updateTransaction(transaction);
  };

  const handleCurrencyChange = (e) => {
    setCurrencyId(e.target.value);
    transaction.currencyId = e.target.value;
    props.updateTransaction(transaction);
  };

  return (
    <Accordion
      component="form"
      className={clsx(classes.transaction, {
        [amount >= 0]: classes.income,
        [amount < 0]: classes.expense,
      })}
    >
      <AccordionSummary expandIcon={<MoreVertIcon />}>
        <FormControlLabel
          onClick={handleCheck}
          onFocus={(e) => e.stopPropagation()}
          control={<Checkbox checked={checked} />}
          label={
            <TransactionLabel
              editMode={editMode}
              amount={amount}
              transaction={transaction}
              onChange={handleAmountChange}
              accounts={props.accounts}
              currencyHandler={props.currencyHandler}
            />
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        {editMode ? (
          <Grid container direction="column">
            <Grid item>
              <AccountSelector
                name="accountId"
                value={accountId}
                accounts={props.accounts}
                onChange={handleAccountChange}
              />
            </Grid>
            <Grid item>
              <CurrencySelector
                name="currencyId"
                value={currencyId}
                onChange={handleCurrencyChange}
                currencyHandler={props.currencyHandler}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container direction="column">
            <Grid item>
              <Typography>
                Account:
                {" " +
                  props.accounts.find((account) => account.id === accountId)
                    .name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                Currency:
                {" " + props.currencyHandler.getName(currencyId)} ({currencyId})
              </Typography>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
      <AccordionActions>
        <Button onClick={handleEdit}>{editMode ? "Save" : "Edit"}</Button>
        <Button onClick={handleRemove}>Remove</Button>
      </AccordionActions>
    </Accordion>
  );
};

export const NewTransaction = (props) => {
  const classes = useStyles();

  const [amount, setAmount] = React.useState();
  const [accountId, setAccountId] = React.useState("");
  const [currencyId, setCurrencyId] = React.useState("");

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleAccountChange = (e) => {
    setAccountId(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrencyId(e.target.value);
  };

  const handleClick = () => {
    props.addTransaction(
      props.expense ? -Math.abs(amount) : amount,
      currencyId,
      accountId
    );
  };

  return (
    <Accordion className={classes.paper}>
      <AccordionSummary expandIcon={props.expandIcon}>
        <Typography>New Transaction</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.newTransaction}>
        <FormControl>
          <TextField
            className={classes.inputField}
            type="number"
            placeholder="Amount"
            onChange={handleAmountChange}
          />
        </FormControl>
        <AccountSelector
          name="accountId"
          value={accountId}
          accounts={props.accounts}
          onChange={handleAccountChange}
        />
        <CurrencySelector
          name="currencyId"
          value={currencyId}
          onChange={handleCurrencyChange}
          currencyHandler={props.currencyHandler}
        />
      </AccordionDetails>
      <AccordionActions>
        <Button onClick={handleClick}>Add</Button>
      </AccordionActions>
    </Accordion>
  );
};

export const TransactionsDayView = (props) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid item xs={12} sm={6}>
        <Paper className={clsx(classes.paper, classes.income)}>
          <Grid container spacing={2} direction="column">
            <Grid item xl={12}>
              <Typography>Incomes</Typography>
            </Grid>
            <Grid item xl={4}>
              {props.transactions.map((transaction) =>
                transaction.amount >= 0 ? (
                  <Transaction
                    key={transaction.id}
                    transaction={transaction}
                    accounts={props.accounts}
                    updateTransaction={props.updateTransaction}
                    removeTransaction={props.removeTransaction}
                    currencyHandler={props.currencyHandler}
                    toggleTransactionCommited={props.toggleTransactionCommited}
                  />
                ) : (
                  ""
                )
              )}
            </Grid>
            <Grid item xl={4}>
              <NewTransaction
                expandIcon={<AddIcon />}
                addTransaction={props.addTransaction}
                accounts={props.accounts}
                currencyHandler={props.currencyHandler}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper className={clsx(classes.paper, classes.expense)}>
          <Grid container spacing={2} direction="column">
            <Grid item xl={12}>
              <Typography>Expenses</Typography>
            </Grid>
            <Grid item xl={3}>
              {props.transactions.map((transaction) =>
                transaction.amount < 0 ? (
                  <Transaction
                    key={transaction.id}
                    transaction={transaction}
                    accounts={props.accounts}
                    updateTransaction={props.updateTransaction}
                    removeTransaction={props.removeTransaction}
                    currencyHandler={props.currencyHandler}
                    toggleTransactionCommited={props.toggleTransactionCommited}
                  />
                ) : (
                  ""
                )
              )}
            </Grid>
            <Grid item xl={4}>
              <NewTransaction
                expandIcon={<RemoveIcon />}
                addTransaction={props.addTransaction}
                accounts={props.accounts}
                currencyHandler={props.currencyHandler}
                expense
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export const TransactionsWeekView = (props) => {
  return "";
};

TransactionsDayView.propTypes = {
  transactions: PropTypes.arrayOf(TransactionData),
  addTransaction: PropTypes.func,
  updateTransaction: PropTypes.func,
  removeTransaction: PropTypes.func,
  accounts: PropTypes.arrayOf(AccountData),
  toggleTransactionCommited: PropTypes.func,
  currencyHandler: PropTypes.instanceOf(CurrencyHandler),
};

Transaction.propTypes = {
  key: PropTypes.string,
  transaction: PropTypes.instanceOf(TransactionData),
  accounts: PropTypes.arrayOf(PropTypes.instanceOf(AccountData)),
  updateTransaction: PropTypes.func,
  removeTransaction: PropTypes.func,
  toggleTransactionCommited: PropTypes.func,
  currencyHandler: PropTypes.instanceOf(CurrencyHandler),
};

TransactionLabel.propTypes = {
  editMode: PropTypes.bool,
  amount: PropTypes.number,
  transaction: PropTypes.instanceOf(TransactionData),
  onChange: PropTypes.func,
  accounts: PropTypes.arrayOf(PropTypes.instanceOf(AccountData)),
  currencyHandler: PropTypes.instanceOf(CurrencyHandler),
};

NewTransaction.propTypes = {
  expandIcon: PropTypes.string,
  addTransaction: PropTypes.func,
  accounts: PropTypes.arrayOf(PropTypes.instanceOf(AccountData)),
  currencyHandler: PropTypes.instanceOf(CurrencyHandler),
};
