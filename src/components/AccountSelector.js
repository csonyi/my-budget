import React from "react";

import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";

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

export default AccountSelector;
