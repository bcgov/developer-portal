import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useEntity } from '@backstage/plugin-catalog-react';
import { InfoCardVariants } from '@backstage/core-components';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
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

interface PolicyToolsCardProps {
  variant?: InfoCardVariants;
}

export function PolicyToolsCard(props: PolicyToolsCardProps) {
  const { variant } = props;
  const classes = useStyles();
  const { entity } = useEntity();

  let cardClass = '';
  if (variant === 'gridItem') {
    cardClass = classes.gridItemCard;
  } else if (variant === 'fullHeight') {
    cardClass = classes.fullHeightCard;
  }

  const tools = entity.spec?.tools as { name: string; alerts: number }[];

  if (Array.isArray(tools) && tools.length) {
    return (
      <Card className={cardClass}>
        <CardHeader
          title={
            <Grid className={classes.header}>
              <Typography variant="h5">Tools</Typography>
            </Grid>
          }
        />
        <Divider />
        <CardContent className={classes.cardContent}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Tool Name</TableCell>
                <TableCell align="center">Alerts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tools.map(tool => (
                <TableRow key={tool.name}>
                  <TableCell component="th" scope="row">
                    {tool.name}
                  </TableCell>
                  <TableCell align="center">{tool.alerts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
  return <></>;
}

interface Compliance {
  name: string;
  compliance_rate: number;
  policies_passed: number;
  policies_total: number;
}

interface MinistryCompliance {
  best_performing: Compliance[];
  needs_improvement: Compliance[];
}

export function PolicyMostCompliantCard(props: PolicyToolsCardProps) {
  const { variant } = props;
  const classes = useStyles();
  const { entity } = useEntity();

  let cardClass = '';
  if (variant === 'gridItem') {
    cardClass = classes.gridItemCard;
  } else if (variant === 'fullHeight') {
    cardClass = classes.fullHeightCard;
  }

  const { best_performing } = entity.spec
    ?.ministry_compliance as unknown as MinistryCompliance;

  return (
    <Card className={cardClass}>
      <CardHeader
        title={
          <Grid className={classes.header}>
            <Typography variant="h5">Most Compliant</Typography>
          </Grid>
        }
      />
      <Divider />
      <CardContent className={classes.cardContent}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Ministry</TableCell>
              <TableCell align="center">Passed</TableCell>
              <TableCell align="center">Passed (%)</TableCell>
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {best_performing.map(ministry => (
              <TableRow key={ministry.name}>
                <TableCell component="th" scope="row">
                  {ministry.name}
                </TableCell>
                <TableCell align="center">{ministry.policies_passed}</TableCell>
                <TableCell align="center">
                  {ministry.compliance_rate}%
                </TableCell>
                <TableCell align="center">{ministry.policies_total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function PolicyLeastCompliantCard(props: PolicyToolsCardProps) {
  const { variant } = props;
  const classes = useStyles();
  const { entity } = useEntity();

  let cardClass = '';
  if (variant === 'gridItem') {
    cardClass = classes.gridItemCard;
  } else if (variant === 'fullHeight') {
    cardClass = classes.fullHeightCard;
  }

  const { needs_improvement } = entity.spec
    ?.ministry_compliance as unknown as MinistryCompliance;

  return (
    <Card className={cardClass}>
      <CardHeader
        title={
          <Grid className={classes.header}>
            <Typography variant="h5">Least Compliant</Typography>
          </Grid>
        }
      />
      <Divider />
      <CardContent className={classes.cardContent}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Ministry</TableCell>
              <TableCell align="center">Passed (%)</TableCell>
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {needs_improvement.map(ministry => (
              <TableRow key={ministry.name}>
                <TableCell component="th" scope="row">
                  {ministry.name}
                </TableCell>
                <TableCell align="center">
                  {ministry.compliance_rate}%
                </TableCell>
                <TableCell align="center">{ministry.policies_total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
