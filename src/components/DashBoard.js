import React from "react";
import PropTypes from "prop-types";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";

import AccountData from "../datamodels/account-model";
import CurrencyHandler from "../datamodels/currency-model";
import TransactionData from "../datamodels/transaction-model";

const currencyHandler = new CurrencyHandler();
currencyHandler.fetchAll();

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
}));

const filterTransactionsByAccountCurrency = (
  currencyId,
  transactionArray,
  accounts
) =>
  transactionArray.filter(
    (transaction) =>
      AccountData.getAccountById(transaction.accountId, accounts).currencyId ===
      currencyId
  );

export default function DashBoard(props) {
  const classes = useStyles();
  const { accounts, transactions } = props;
  const [
    convertedTransactionSums,
    setConvertedTransactionSums,
  ] = React.useState([]);

  const currenciesInUse = React.useMemo(
    () =>
      accounts.reduce((currencies, account) => {
        if (currencies.indexOf(account.currencyId) === -1) {
          currencies.push(account.currencyId);
        }
        return currencies;
      }, []),
    [accounts]
  );

  const balances = currenciesInUse.reduce(
    (balances, currencyId) => ({
      ...balances,
      [currencyId]: accounts
        .filter((account) => account.currencyId === currencyId)
        .reduce((sum, account) => sum + account.balance, 0),
    }),
    {}
  );

  React.useEffect(() => {
    async function helperFunction() {
      let convertedSums = {};
      for (const currencyId of currenciesInUse) {
        const filteredTransactions = filterTransactionsByAccountCurrency(
          currencyId,
          transactions,
          accounts
        );
        const currentBalances = await filteredTransactions.reduce(
          async (memo, transaction) => {
            const memoResult = memo === 0 ? memo : await memo;
            if (transaction.currencyId !== currencyId) {
              const convertedAmount = await currencyHandler.convert(
                transaction.currencyId,
                currencyId,
                transaction.amount
              );
              return memoResult + convertedAmount;
            }
            return memoResult + transaction.amount;
          },
          0
        );

        convertedSums = {
          ...convertedSums,
          [currencyId]: currentBalances,
        };
      }
      setConvertedTransactionSums(convertedSums);
    }
    helperFunction();
  }, [accounts, transactions, currenciesInUse]);

  const projectedBalances = currenciesInUse.reduce(
    (balanceSums, currencyId) => ({
      ...balanceSums,
      [currencyId]: balances[currencyId] + convertedTransactionSums[currencyId],
    }),
    {}
  );
  console.log(convertedTransactionSums);
  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12}>
            <Typography>Balances</Typography>
            <Typography variant="caption">by currency</Typography>
          </Grid>
          {currenciesInUse.map((currencyId) => (
            <Grid key={currencyId} xs={2} item>
              <Accordion>
                <AccordionSummary>
                  {currencyHandler.formatCurrency(
                    balances[currencyId],
                    currencyId
                  )}
                </AccordionSummary>
                <AccordionDetails></AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12}>
            <Typography>Projected Balances</Typography>
            <Typography variant="caption">by currency</Typography>
          </Grid>
          {currenciesInUse.map((currencyId) => (
            <Grid key={currencyId} xs={2} item>
              <Accordion>
                <AccordionSummary>
                  {currencyHandler.formatCurrency(
                    projectedBalances[currencyId],
                    currencyId
                  )}
                </AccordionSummary>
                <AccordionDetails></AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

DashBoard.propTypes = {
  accounts: PropTypes.arrayOf(AccountData),
  currencyHandler: PropTypes.instanceOf(CurrencyHandler),
  transactions: PropTypes.arrayOf(TransactionData),
};
