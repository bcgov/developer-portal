import React, { ReactNode } from 'react';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@backstage/core-components';
import { ResultHighlight } from '@backstage/plugin-search-common';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';
import { SearchDocument } from '@backstage/plugin-search-common';
import { EntityRefLink } from '@backstage/plugin-catalog-react';

export interface GithubDiscussionsDocument extends SearchDocument {
  author: string;
  category: string;
  labels: {
    name: string;
    color: string;
  }[];
  comments: {
    author: string;
    bodyText: string;
    replies: {
      author: string;
      bodyText: string;
    }[];
  }[];
}

const useStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
  },
  flexContainer: {
    flexWrap: 'wrap',
  },
  itemText: {
    width: '100%',
    wordBreak: 'break-all',
    marginBottom: '1rem',
  },
  user: {
    display: 'inline-flex',
    margin: theme.spacing(1),
  },
}));

/**
 * Props for {@link GithubDiscussionsSearchResultListItem}.
 *
 * @public
 */
export interface GithubDiscussionsSearchResultListItemProps {
  icon?: ReactNode;
  result?: GithubDiscussionsDocument;
  highlight?: ResultHighlight;
  lineClamp?: number;
}

/** @public */
export function GithubDiscussionsSearchResultListItem(
  props: GithubDiscussionsSearchResultListItemProps,
) {
  const { result, highlight, icon, lineClamp } = props;
  const classes = useStyles();
  if (!result) return null;

  return (
    <div className={classes.item}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <div className={classes.flexContainer}>
        <ListItemText
          className={classes.itemText}
          primaryTypographyProps={{ variant: 'h6' }}
          primary={
            <Link noTrack to={result.location}>
              {highlight?.fields.title ? (
                <HighlightedSearchResultText
                  text={highlight.fields.title}
                  preTag={highlight.preTag}
                  postTag={highlight.postTag}
                />
              ) : (
                result.title
              )}
            </Link>
          }
          secondary={
            <Typography
              component="span"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: lineClamp,
                overflow: 'hidden',
              }}
              color="textSecondary"
              variant="body2"
            >
              {highlight?.fields.text ? (
                <HighlightedSearchResultText
                  text={highlight.fields.text}
                  preTag={highlight.preTag}
                  postTag={highlight.postTag}
                />
              ) : (
                result.text
              )}
            </Typography>
          }
        />
        <Box>
          {result.author && (
            <div className={classes.user}>
              <EntityRefLink entityRef={`user:default/${result.author}`} />
            </div>
          )}
          {result.category && <Chip label={result.category} size="small" />}
          {result.labels.length > 0 &&
            result.labels.map(({ name }) => {
              return <Chip key={name} label={name} size="small" />;
            })}
        </Box>
      </div>
    </div>
  );
}
