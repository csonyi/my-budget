import React from "react";
import PropTypes from "prop-types";

import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import AccountData from "../datamodels/account-model";

const useStyles = makeStyles(() => ({
  selectField: {
    minWidth: 120,
    maxWidth: 250,
  },
}));

const AccountSelector = (props) => {
  const classes = useStyles();
  let { name, accounts, value } = props;
  return (
    <FormControl>
      <InputLabel>Account</InputLabel>
      <Select
        className={classes.selectField}
        name={name}
        value={value}
        onChange={props.onChange}
      >
        <MenuItem value="" />
        {accounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

AccountSelector.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  accounts: PropTypes.arrayOf(PropTypes.instanceOf(AccountData)),
  onChange: PropTypes.func,
};

export default AccountSelector;
