import React from 'react';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { InfoCardVariants } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Link } from '@material-ui/core';

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
  policyRowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '12px',
  },
  policyRowContent: {
    display: 'flex',
    alignItems: 'center',
  },
  policyRowDescription: {
    marginLeft: '15px',
  },
  policyRowCheckbox: {
    fill: '#00be00',
    fontSize: 40,
  },
});

const exampleComponentPolicies = [
  'Component performs dependency chain analysis',
  'Container vulnerability scanning report is 34 days old',
  'Repository uses an automated dependency update tool',
  'No crticial alerts older than 30 days',
  'Repository does not contain unencrypted secrets',
];

const PolicyRow = ({ description }: { description: string }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.policyRowContainer}>
      <Grid className={classes.policyRowContent}>
        <CheckBoxIcon className={classes.policyRowCheckbox} />
        <Typography className={classes.policyRowDescription}>
          {description}
        </Typography>
      </Grid>
      <Link style={{ cursor: 'pointer' }} variant="body2">
        Learn more
      </Link>
    </Grid>
  );
};

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
      <CardContent className={classes.cardContent}>
        {exampleComponentPolicies.map(policy => (
          <>
            <PolicyRow description={policy} />
            <Divider variant="middle" />
          </>
        ))}
      </CardContent>
    </Card>
  );
}
