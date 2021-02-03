import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import {
  AppBar,
  makeStyles,
  Toolbar,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: theme.drawerWidth,
    width: `calc(100% - ${theme.drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  hide: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  select: {
    marginLeft: "1rem",
  },
}));

function MyAppBar(props) {
  const classes = useStyles();
  const [balance, setBalance] = React.useState(0);

  const handleBalanceSelect = (e) => {
    setBalance(e.target.value);
  };

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.isDrawerOpen,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={props.onDrawerToggle}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: props.isDrawerOpen,
          })}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title} noWrap>
          MyBudget
        </Typography>
        <Typography variant="h6">
          Balance:
          <FormControl>
            <Select
              displayEmpty
              className={classes.select}
              value={balance}
              onChange={handleBalanceSelect}
            >
              {props.balances.map((balance) => (
                <MenuItem
                  key={props.balances.indexOf(balance)}
                  value={props.balances.indexOf(balance)}
                >
                  {balance}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

MyAppBar.propTypes = {
  balances: PropTypes.arrayOf(PropTypes.string),
  onDrawerToggle: PropTypes.func,
  isDrawerOpen: PropTypes.bool,
};

export default MyAppBar;
