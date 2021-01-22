import React from "react";
import MyDrawer from "./components/MyDrawer";

class MyBudget extends React.Component {
  state = {
    balance: 9001,
  };
  render() {
    return (
      <React.Fragment>
        <MyDrawer balance={this.state.balance} />
      </React.Fragment>
    );
  }
}

export default MyBudget;
