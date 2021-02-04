import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { NIL as defaultId } from "uuid";
import CurrencySelector from "./CurrencySelector";

import CurrencyHandler from "../datamodels/currency-model";
const currencyHandler = CurrencyHandler.instance;

const cardStyle = {
  minHeight: "250px",
};

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false };
  }

  AccountContent = (props) => {
    let { name, balance, currencyId } = this.props.accountData;
    return this.state.editMode ? (
      <Grid container component="form" direction="column">
        <Grid item xs={12}>
          <TextField
            name="name"
            placeholder="Name"
            value={name}
            onChange={this.handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="balance"
            placeholder="Balance"
            value={balance}
            onChange={this.handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencySelector
            name="currencyId"
            value={currencyId}
            onChange={this.handleChange}
          />
        </Grid>
      </Grid>
    ) : (
      balance + " " + currencyHandler.getSymbol(currencyId)
    );
  };

  handleChange = (e) => {
    const updatedAccount = {
      ...this.props.accountData,
      [e.target.name]: e.target.value,
    };
    this.props.updateAccount(updatedAccount);
  };

  handleEdit = (e) => {
    if (this.state.editMode) this.props.updateAccount(this.props.accountData);
    this.setState(() => ({
      editMode: !this.state.editMode,
    }));
  };

  render() {
    let { id, name, balance, currencyId } = this.props.accountData;
    return (
      <Card raised style={cardStyle}>
        <CardHeader
          title={this.state.editMode ? "Edit Account" : name}
          subheader={
            this.state.editMode ? "" : currencyHandler.getName(currencyId)
          }
          color="primary"
        />
        <CardContent component="h1">
          <this.AccountContent updateAccount={this.props.updateAccount} />
        </CardContent>
        <CardActions>
          <Button onClick={this.handleEdit}>
            {this.state.editMode ? "Save" : "Edit"}
          </Button>
          {id === defaultId ? (
            ""
          ) : (
            <Button onClick={() => this.props.removeAccount(id)}>Remove</Button>
          )}
        </CardActions>
      </Card>
    );
  }
}

class NewAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      initialBalance: "",
      currencyId: "",
    };
  }

  handleChange = (e) => {
    let newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState({
      ...newState,
    });
  };

  handleSubmit = (e) => {
    if (
      this.state.name === "" ||
      this.state.initialBalance === "" ||
      this.state.currencyId === ""
    ) {
      return;
    }
    this.props.addAccount(
      this.state.name,
      this.state.initialBalance,
      this.state.currencyId
    );
    this.setState({
      name: "",
      initialBalance: "",
      currencyId: "",
    });
  };

  render() {
    return (
      <Card raised style={cardStyle}>
        <CardHeader title="New Account" />
        <CardContent>
          <Grid container component="form" direction="column">
            <Grid item xs={12}>
              <TextField
                name="name"
                placeholder="Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="initialBalance"
                placeholder="Initial Balance"
                type="number"
                value={this.state.initialBalance}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <CurrencySelector
                name="currencyId"
                value={this.state.currencyId}
                onChange={this.handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button onClick={this.handleSubmit}>Add</Button>
        </CardActions>
      </Card>
    );
  }
}

export default function Accounts(props) {
  const accounts = props.accounts;
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {accounts.map((acc) => (
          <Grid key={acc.id} item xs={12} sm={6} md={3} lg={2}>
            <Account
              accountData={acc}
              removeAccount={props.removeAccount}
              updateAccount={props.updateAccount}
            />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <NewAccount addAccount={props.addAccount} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
