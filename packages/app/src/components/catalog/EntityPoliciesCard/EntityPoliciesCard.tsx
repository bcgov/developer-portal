import React from 'react';
import Avatar from '@material-ui/core/Avatar';
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

const ratingChip = {
  borderRadius: '10px',
  width: '90px',
  marginLeft: '10px',
  color: 'gray',
};

const avatar = {
  color: 'black',
  padding: '20px',
  marginRight: '15px',
};

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
  ratingGold: {
    ...ratingChip,
    backgroundColor: 'gold',
    border: '3px solid yellow',
  },
  ratingBronze: {
    ...ratingChip,
    backgroundColor: '#faaf08',
    border: '3px solid gold',
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
    flex: 4,
    alignItems: 'center',
  },
  policyRowCheckbox: {
    fill: '#00be00',
    fontSize: 40,
    marginRight: '15px',
  },
  red: {
    ...avatar,
    backgroundColor: 'pink',
  },
  green: {
    ...avatar,
    backgroundColor: 'lime',
  },
});

const exampleComponentPolicies = [
  'Component performs dependency chain analysis',
  'Container vulnerability scanning report is 34 days old',
  'Repository uses an automated dependency update tool',
  'No crticial alerts older than 30 days',
  'Repository does not contain unencrypted secrets',
];

const exampleSystemPolicies = [
  {
    red: 3,
    green: 7,
    description:
      'All components in the system perform dependency chain analysis',
  },
  {
    red: 0,
    green: 5,
    description:
      'All services in the system have container vulnerability scanning reports that are <90 days old',
  },
  {
    red: 10,
    green: 0,
    description:
      'All components in the system are configured to automatically update dependencies',
  },
  {
    red: 47,
    green: 0,
    description:
      'Components do not have dependency CRITICAL alerts older than 30 days',
  },
  {
    red: 0,
    green: 10,
    description:
      'Components do not store unencrypted credentials in the repository',
  },
];

interface PoliciesCardProps {
  variant?: InfoCardVariants;
  rating?: string | undefined;
}

const PolicyRow1 = ({ policy }: { policy: string }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.policyRowContainer}>
      <Grid className={classes.policyRowContent}>
        <CheckBoxIcon className={classes.policyRowCheckbox} />
        <Typography>{policy}</Typography>
      </Grid>
      <Link style={{ cursor: 'pointer' }} variant="body2">
        Learn more
      </Link>
    </Grid>
  );
};

const PolicyRow2 = ({
  policy: { red, green, description },
}: {
  policy: {
    red: number;
    green: number;
    description: string;
  };
}) => {
  const classes = useStyles();
  return (
    <Grid className={classes.policyRowContainer}>
      <Grid className={classes.policyRowContent}>
        <Avatar className={classes.red}>{red}</Avatar>
        <Avatar className={classes.green}>{green}</Avatar>
        <Typography>{description}</Typography>
      </Grid>
      <Link style={{ cursor: 'pointer' }} variant="body2">
        Learn more
      </Link>
    </Grid>
  );
};

const PolicyRating = ({ rating }: { rating: string | undefined }) => {
  const classes = useStyles();
  if (rating === 'GOLD') {
    return (
      <Grid className={classes.headerRating}>
        <Typography variant="body2">Security Rating</Typography>
        <Chip label="GOLD" className={classes.ratingGold} />
      </Grid>
    );
  }
  return (
    <Grid className={classes.headerRating}>
      <Typography variant="body2">Security Rating</Typography>
      <Chip label="BRONZE" className={classes.ratingBronze} />
    </Grid>
  );
};

export function EntityPoliciesCard(props: PoliciesCardProps) {
  const { variant, rating } = props;
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
            <PolicyRating rating={rating} />
          </Grid>
        }
      />
      <Divider />
      <CardContent className={classes.cardContent}>
        {entity.kind === 'Component'
          ? exampleComponentPolicies.map(policy => (
              <>
                <PolicyRow1 policy={policy} />
                <Divider variant="middle" />
              </>
            ))
          : exampleSystemPolicies.map(policy => (
              <>
                <PolicyRow2 policy={policy} />
                <Divider variant="middle" />
              </>
            ))}
      </CardContent>
    </Card>
  );
}
