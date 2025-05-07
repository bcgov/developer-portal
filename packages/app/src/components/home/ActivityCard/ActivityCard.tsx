import React from 'react';
import { Card, CardContent, CardHeader, makeStyles } from '@material-ui/core';
import { VisitList } from './VisitList';
import * as tokens from '@bcgov/design-tokens/js';

const useStyles = makeStyles({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: tokens.surfaceBackground,
    // borderRadius: tokens.borderRadiusMedium,
    // boxShadow: tokens.shadowCard,
  },
  cardHeader: {
    paddingBottom: 0,
  },
  cardContent: {
    flex: 1,
    paddingTop: tokens.layoutPaddingSmall,
    '&:last-child': {
      paddingBottom: tokens.layoutPaddingMedium,
    },
  },
});

export type ActivityCardProps = {
  title: string;
  maxItems?: number;
  mode: 'recent' | 'frequent';
  description?: string;
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  maxItems = 5,
  mode,
  description,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={0}>
      <CardHeader title={title} className={classes.cardHeader} />
      <CardContent className={classes.cardContent}>
        {description && <p>{description}</p>}
        <VisitList title={title} maxItems={maxItems} mode={mode} />
      </CardContent>
    </Card>
  );
};
