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
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import clsx from "clsx";
import AccountData from "../datamodels/account-model";

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
  let transactionData = props.transaction;
  const [editMode, setEditMode] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const classes = useStyles();

  const accountList = props.accounts.map((account) => (
    <MenuItem key={account.id} value={account.id}>
      {account.name}
    </MenuItem>
  ));

  const handleClick = (e) => {
    setEditMode(!editMode);
  };

  const handleCheck = (e) => {
    e.stopPropagation();
    setChecked(!checked);
    transactionData.completed = checked;
  };

  return (
    <Accordion
      component="form"
      className={clsx(classes.accordion, {
        [transactionData.amount >= 0]: classes.income,
        [transactionData.amount < 0]: classes.expense,
      })}
    >
      <AccordionSummary expandIcon={<MoreVertIcon />}>
        <FormControlLabel
          onClick={handleCheck}
          onFocus={(e) => e.stopPropagation()}
          control={<Checkbox />}
          label={
            editMode ? (
              <TextField value={transactionData.amount} />
            ) : (
              (transactionData.amount >= 0 ? "+" : "") +
              transactionData.amount +
              AccountData.getCurrencySymbol(transactionData.currency)
            )
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        {editMode ? (
          <FormControl>
            <Select value={transactionData.accountId} children={accountList} />
          </FormControl>
        ) : (
          <Typography>
            Account:{" "}
            {
              props.accounts.find(
                (account) => account.id === transactionData.accountId
              ).name
            }
          </Typography>
        )}
      </AccordionDetails>
      <AccordionActions>
        <Button onClick={handleClick}>{editMode ? "Save" : "Edit"}</Button>
      </AccordionActions>
    </Accordion>
  );
};

export const NewTransaction = (props) => {
  const classes = useStyles();
  const accountList = props.accounts.map((account) => (
    <MenuItem
      key={props.accounts.indexOf(account)}
      value={props.accounts.indexOf(account)}
    >
      {account.name}
    </MenuItem>
  ));
  return (
    <Accordion className={classes.paper}>
      <AccordionSummary expandIcon={props.expandIcon}>
        <Typography>New Transaction</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.newTransaction}>
        <FormControl>
          <TextField placeholder="Amount" />
        </FormControl>
        <FormControl>
          <InputLabel>Account</InputLabel>
          <Select children={accountList} />
        </FormControl>
      </AccordionDetails>
      <AccordionActions>
        <Button>Save</Button>
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
            <Grid item xl={3}>
              {props.transactions.map((transaction) =>
                transaction.amount >= 0 ? (
                  <Transaction
                    key={transaction.id}
                    transaction={transaction}
                    accounts={props.accounts}
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
