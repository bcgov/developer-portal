import React from 'react';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { InfoCardVariants } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import { useEntity } from '@backstage/plugin-catalog-react';

interface PoliciesCardProps {
  variant?: InfoCardVariants;
}

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  headerRating: {
    display: 'flex',
    alignItems: 'center',
  },
  goldRating: {
    backgroundColor: 'gold',
    border: '3px solid orange',
    borderRadius: '10px',
    padding: '5px',
    marginLeft: '10px',
    color: 'gray',
  },
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 10px)',
    marginBottom: '10px',
  },
  fullHeightCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardContent: {
    flex: 1,
  },
});

export function EntityPoliciesCard(props: PoliciesCardProps) {
  const { variant } = props;
  const classes = useStyles();
  const { entity } = useEntity();

  let cardClass = '';
  if (variant === 'gridItem') {
    cardClass = classes.gridItemCard;
  } else if (variant === 'fullHeight') {
    cardClass = classes.fullHeightCard;
  }

  return (
    <Card className={cardClass}>
      <CardHeader
        title={
          <Grid className={classes.header}>
            <Typography variant="h5">Security Policies</Typography>
            <Grid className={classes.headerRating}>
              <Typography variant="body2">Security Rating</Typography>
              <Chip label="GOLD" className={classes.goldRating} />
            </Grid>
          </Grid>
        }
      />
      <Divider />
      <CardContent className={classes.cardContent} />
    </Card>
  );
}
