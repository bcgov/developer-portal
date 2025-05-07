import React, { useEffect, useState } from 'react';
import { Link } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Visit, visitsApiRef } from '@backstage/plugin-home';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
} from '@material-ui/core';
import * as tokens from '@bcgov/design-tokens/js';

const useStyles = makeStyles({
  listItem: {
    padding: `${tokens.layoutPaddingSmall} 0`,
    borderBottom: `1px solid ${tokens.themeGray20}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  title: {
    fontWeight: 'bold',
  },
  path: {
    color: tokens.themeGray70,
    fontSize: '0.85rem',
  },
  emptyState: {
    padding: tokens.layoutPaddingMedium,
    textAlign: 'center',
    color: tokens.themeGray70,
  },
});

export type VisitListProps = {
  title: string;
  maxItems?: number;
  mode: 'recent' | 'frequent';
};

export const VisitList = ({ maxItems = 5, mode }: VisitListProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const visitsApi = useApi(visitsApiRef);
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const modeField = mode === 'recent' ? 'timestamp' : 'hits';
        const visitData = await visitsApi.list({
          limit: maxItems,
          orderBy: [{ field: modeField, direction: 'desc' }],
          filterBy: [
            { field: 'entityRef', operator: 'contains', value: 'component:' },
          ],
        });
        setVisits(visitData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visitsApi, maxItems, mode]);

  if (loading) {
    return <div>Loading visits...</div>;
  }

  if (error) {
    return <div>Error loading visits: {error.message}</div>;
  }

  if (visits.length === 0) {
    return (
      <Typography variant="body2" className={classes.emptyState}>
        No {mode === 'recent' ? 'recent' : 'frequent'} activity to display
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {visits.map((item, index) => (
        <ListItem key={index} className={classes.listItem} disableGutters>
          <ListItemText
            primary={
              <Link to={item.pathname}>
                <Typography variant="body1" className={classes.title}>
                  {item.name || 'Untitled'}
                </Typography>
              </Link>
            }
            secondary={
              <Typography variant="body2" className={classes.path}>
                {item.pathname}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};
