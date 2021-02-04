import React from "react";

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

import CurrencyHandler from "../datamodels/currency-model";
import AccountSelector from "./AccountSelector";
import CurrencySelector from "./CurrencySelector";
const currencyHandler = CurrencyHandler.instance;

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
}));

export const Transaction = (props) => {
  let transaction = props.transaction;
  const transactionCurrency = currencyHandler.getCurrency(
    transaction.currencyId
  );
  const [editMode, setEditMode] = React.useState(false);
  const [checked, setChecked] = React.useState(transaction.completed);
  const [accountId, setAccountId] = React.useState(transaction.accountId);
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

  return (
    <Accordion
      component="form"
      className={clsx(classes.accordion, {
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
            editMode ? (
              <TextField
                type="number"
                onChange={handleAmountChange}
                onClick={(e) => e.stopPropagation()}
                value={amount}
              />
            ) : (
              (transaction.amount >= 0 ? "+" : "") +
              transaction.amount +
              " " +
              currencyHandler.getSymbol(transaction.currencyId)
            )
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        {editMode ? (
          <AccountSelector
            name="accountId"
            value={accountId}
            accounts={props.accounts}
            onChange={handleAccountChange}
          />
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
                {" " + transactionCurrency.currencyName} (
                {transactionCurrency.id})
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
