/*
 * TechDocsSearchResultCustomListItem.tsx is a customized version of the original TechDocsSearchResultListItem.tsx
 * This version removes the entityTitle from the result title and places it as a tag instead
 */

/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { PropsWithChildren, ReactNode } from 'react';
import { Box, Chip, Divider, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Link } from '@backstage/core-components';
import { ResultHighlight } from '@backstage/plugin-search-common';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';

const useStyles = makeStyles({
  flexContainer: {
    flexWrap: 'wrap',
  },
  itemText: {
    width: '100%',
    marginBottom: '1rem',
  },
});

/**
 * Props for {@link TechDocsSearchResultCustomListItem}.
 *
 * @public
 */
export type TechDocsSearchResultListItemProps = {
  icon?: ReactNode | ((result: any) => ReactNode);
  result?: any;
  highlight?: ResultHighlight;
  rank?: number;
  lineClamp?: number;
  asListItem?: boolean;
  asLink?: boolean;
  title?: string;
};

/**
 * Component which renders documentation and related metadata.
 *
 * @public
 */
export const TechDocsSearchResultCustomListItem = (
  props: TechDocsSearchResultListItemProps,
) => {
  const {
    result,
    highlight,
    lineClamp = 5,
    asListItem = true,
    asLink = true,
    title,
    icon,
  } = props;
  const classes = useStyles();

  const LinkWrapper = ({ children }: PropsWithChildren<{}>) =>
    asLink ? (
      <Link noTrack to={result.location}>
        {children}
      </Link>
    ) : (
      <>{children}</>
    );

  const TextItem = () => {
    const resultTitle = highlight?.fields.title ? (
      <HighlightedSearchResultText
        text={highlight.fields.title}
        preTag={highlight.preTag}
        postTag={highlight.postTag}
      />
    ) : (
      result.title
    );

    const entityTitle = highlight?.fields.entityTitle ? (
      <HighlightedSearchResultText
        text={highlight.fields.entityTitle}
        preTag={highlight.preTag}
        postTag={highlight.postTag}
      />
    ) : (
      result.entityTitle
    );

    const resultName = highlight?.fields.name ? (
      <HighlightedSearchResultText
        text={highlight.fields.name}
        preTag={highlight.preTag}
        postTag={highlight.postTag}
      />
    ) : (
      result.name
    );

    if (!result) return null;

    return (
        <>
            <ListItem alignItems="center">
                {icon && <ListItemIcon>
                    {typeof icon === 'function' ? icon(result) : icon}
                </ListItemIcon>}
                <Box flexWrap="wrap">
                    <ListItemText
                        className={classes.itemText}
                        primaryTypographyProps={{ variant: 'h6' }}
                        primary={
                            <LinkWrapper>
                                {title ? (
                                title
                                ) : (
                                <>
                                    {resultTitle} docs
                                </>
                                )}
                            </LinkWrapper>
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
                    <Chip label={entityTitle ?? resultName} size="small" />
                </Box>
            </ListItem>
            <Divider />
        </>
    );
  };

  const ListItemWrapper = ({ children }: PropsWithChildren<{}>) =>
    asListItem ? (
      <>
        <div className={classes.flexContainer}>{children}</div>
      </>
    ) : (
      <>{children}</>
    );

  return (
    <ListItemWrapper>
      <TextItem />
    </ListItemWrapper>
  );
};