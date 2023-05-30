import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 32,
  },
  st0: {fill:'#F26925'},
	st1: {fill:'#FDB918'},
	st2: {fill:'#1B9AD6'},
	st3: {fill:'#FFFFFF'}, // DEFAULT: 0C4D8D
});

const LogoIcon = () => {
  const classes = useStyles();

  return (
    <svg
      className={classes.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 199.7 200"
    >
      <polygon className={classes.st0} points="0,0 42.8,0 78.2,62.5 57.3,100 "/>
      <polygon className={classes.st1} points="42.7,0 85.6,0 121,63.2 100,101.1 "/>
      <polygon className={classes.st0} points="78.6,139.7 100.1,100.8 156.4,200 113.7,200 "/>
      <polygon className={classes.st1} points="121.9,139.7 143.3,101.1 199.7,200 156.4,200 "/>
      <polygon className={classes.st2} points="99.3,24.6 112.5,0 156,0 121,63.2 "/>
      <polygon className={classes.st2} points="78.2,62.5 100.1,100.8 46,199.8 2.2,199.8 "/>
      <polygon className={classes.st3} points="100.1,100.8 156,0 199.1,0 121.9,139.7 "/>
      <polygon className={classes.st3} points="78.6,139.7 100.7,177.7 89.6,200 45.9,200 "/>
    </svg>
  );
};

export default LogoIcon;
