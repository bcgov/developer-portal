import React, { useEffect, useState } from 'react';
import { Link } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Visit, visitsApiRef } from '@backstage/plugin-home';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
  Box,
} from '@material-ui/core';
import * as tokens from '@bcgov/design-tokens/js';

// Define the EntityName interface locally since we can't import it
interface EntityName {
  kind: string;
  namespace: string;
  name: string;
}

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
  const catalogApi = useApi(catalogApiRef);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [entityTitles, setEntityTitles] = useState<Record<string, string>>({});

  // Parse entity info from TechDocs URL path: /docs/{namespace}/{kind}/{name}
  const parseEntityRefFromPath = (pathname: string): EntityName | undefined => {
    const matches = pathname.match(/^\/docs\/([^\/]+)\/([^\/]+)\/([^\/]+)/);
    if (matches && matches.length === 4) {
      return {
        namespace: matches[1],
        kind: matches[2],
        name: matches[3],
      };
    }
    return undefined;
  };

  // Create an entity reference string from an EntityName object
  const createEntityRef = (entity: EntityName): string => {
    return `${entity.kind}:${entity.namespace}/${entity.name}`;
  };

  // Fetch entity titles from the catalog API for the given visit items
  useEffect(() => {
    const fetchEntityTitles = async () => {
      if (visits.length === 0) return;

      const entityRefs: Record<string, EntityName> = {};
      const titles: Record<string, string> = {};

      // First extract entity references from all visits
      visits.forEach(visit => {
        const entityRef = parseEntityRefFromPath(visit.pathname);
        if (entityRef) {
          entityRefs[visit.pathname] = entityRef;
        }
      });

      // Then fetch entity information for each unique entity
      try {
        for (const [pathname, entityRef] of Object.entries(entityRefs)) {
          try {
            // Convert EntityName to a string ref
            const stringRef = createEntityRef(entityRef);
            const entity = await catalogApi.getEntityByRef(stringRef);
            if (entity) {
              titles[pathname] = entity.metadata.title || entity.metadata.name;
            }
          } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
          }
        }
        setEntityTitles(titles);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    fetchEntityTitles();
  }, [visits, catalogApi]);

  // Helper function to get the title for a visit item
  const getDocumentTitle = (item: Visit): string => {
    // First try to get title from the catalog API results
    const catalogTitle = entityTitles[item.pathname];
    if (catalogTitle) {
      return catalogTitle;
    }

    // If we have a name from the visit record, use it
    if (item.name) {
      return item.name;
    }

    // Otherwise, extract a readable title from the pathname
    const segments = item.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment) return 'Untitled document';

    // Convert kebab-case to readable title format
    const title = lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return title;
  };

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
            { field: 'pathname', operator: 'contains', value: '/docs/' }, // startsWith /docs/ would be better
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
                  {getDocumentTitle(item)}
                </Typography>
              </Link>
            }
            secondary={
              <>
                <Typography variant="body2" className={classes.path}>
                  {item.pathname.replace('/docs/default/component/', '')}
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
