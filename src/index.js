import "./index.css";
import "fontsource-roboto";
import reportWebVitals from "./reportWebVitals";

import React from "react";
import ReactDOM from "react-dom";

import CssBaseLine from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import MyBudget from "./MyBudget";
import theme from "./theme";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseLine />
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <MyBudget />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
