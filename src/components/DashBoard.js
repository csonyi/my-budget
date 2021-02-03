import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

export default function DashBoard(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Grid container direction="column">
      <Grid item>Header</Grid>
      <Grid item container>
        <Grid item xs={12}></Grid>
      </Grid>
    </Grid>
  );
}
