import React from "react";
import PropTypes from "prop-types";

import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";

import CurrencyHandler from "../datamodels/currency-model";
const currencyHandler = CurrencyHandler.instance;

const useStyles = makeStyles(() => ({
  selectField: {
    minWidth: 120,
    maxWidth: 250,
  },
}));

const CurrencySelector = (props) => {
  const classes = useStyles();
  return (
    <FormControl>
      <InputLabel>Currency</InputLabel>
      <Select
        className={classes.selectField}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      >
        <MenuItem value="" />
        {Object.keys(currencyHandler.currencies).map((currency) => {
          const currencyObject = currencyHandler.currencies[currency];
          return (
            <MenuItem key={currencyObject.id} value={currencyObject.id}>
              {currencyObject.currencyName} ({currencyObject.id})
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

CurrencyHandler.propTypes = {
  currencyId: PropTypes.string,
};

export default CurrencySelector;
