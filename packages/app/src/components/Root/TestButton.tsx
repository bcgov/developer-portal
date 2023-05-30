import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import { Button } from '@backstage/core-components';
import { devExTheme as theme } from '../../devex-theme';

const useStyles = makeStyles(() =>
  createStyles({
    devExCustomButton: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      // Other custom styles
    },
  }),
);

function TestButton() {
  const classes = useStyles();

  return (
    <Button className={classes.devExCustomButton}>
      Custom Button
    </Button>
  );
}

export default TestButton;
