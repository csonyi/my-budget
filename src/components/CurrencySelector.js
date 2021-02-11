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

const useStyles = makeStyles(() => ({
  selectField: {
    minWidth: 120,
    maxWidth: 250,
  },
}));

const CurrencySelector = (props) => {
  const { name, value, onChange, currencyHandler } = props;
  const classes = useStyles();
  return (
    <FormControl>
      <InputLabel>Currency</InputLabel>
      <Select
        className={classes.selectField}
        name={name}
        value={value}
        onChange={onChange}
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

CurrencySelector.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  currencyHandler: PropTypes.instanceOf(CurrencyHandler),
};

export default CurrencySelector;
