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
  Box,
} from '@material-ui/core';
import * as tokens from '@bcgov/design-tokens/js';

const useStyles = makeStyles({
  listItem: {
    padding: `0 0`,
    borderBottom: `1px solid ${tokens.themeGray20}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  title: {
    fontWeight: 'bold',
    color: tokens.typographyColorLink,
  },
  path: {
    color: tokens.themeGray80,
    fontSize: '0.85rem',
  },
  emptyState: {
    padding: tokens.layoutPaddingMedium,
    textAlign: 'center',
    color: tokens.themeGray70,
  },
  contextDetails: {
    fontSize: '0.8rem',
    color: tokens.themeGray70,
    marginTop: '2px',
  },
});

/**
 * Formats a timestamp into a human-readable "time ago" string
 */
function formatTimeAgo(timestamp: number): string {
  const now = new Date();
  const visitTime = new Date(timestamp); // This will handle the Unix timestamp in ms
  const diffMs = now.getTime() - visitTime.getTime();

  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) {
    return `${diffSecs} sec${diffSecs !== 1 ? 's' : ''} ago`;
  }

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
}

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
              <>
                <Typography variant="body2" className={classes.path}>
                  {item.pathname.replace('/catalog/default/component/', '')}
                </Typography>
                <Box className={classes.contextDetails}>
                  {mode === 'recent'
                    ? item.timestamp && formatTimeAgo(item.timestamp)
                    : item.hits !== undefined &&
                      `Visited ${item.hits} time${item.hits !== 1 ? 's' : ''}`}
                </Box>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};
