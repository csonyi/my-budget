import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
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
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Paper className={classes.paper}>
          <Typography>asdasdasd</Typography>
        </Paper>
        <Paper className={classes.paper}>
          <Typography>asdasdasd</Typography>
        </Paper>
        <Paper className={classes.paper}>
          <Typography>asdasdasd</Typography>
        </Paper>
      </Grid>
    </Container>
  );
}
