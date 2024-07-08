import React from 'react';

import { List } from '@material-ui/core';
import { SearchResult, DefaultResultListItem } from '@backstage/plugin-search-react';

import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
import { StackOverflowSearchResultListItem, StackOverflowIcon } from '@backstage-community/plugin-stack-overflow';
import { CatalogIcon, DocsIcon } from '@backstage/core-components';
import { TechDocsSearchResultCustomListItem } from './TechDocsSearchResultCustomListItem';
import { refreshLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

const SearchResultCustomList = () => {
    return (
        <SearchResult>
            {({ results }) => (
                <List onMouseEnter={() => refreshLinkClickTracking()}>
                  {results.map(({ type, document, highlight, rank }) => {
                    switch (type) {
                      case 'software-catalog':
                        return (
                          <CatalogSearchResultListItem
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                            icon={<CatalogIcon />}
                          />
                        );
                      case 'techdocs':
                        return (
                          <TechDocsSearchResultCustomListItem
                            key={document.location}
                            result={document}                            
                            highlight={highlight}
                            rank={rank}
                            asListItem={true}
                            icon={<DocsIcon />}
                          />
                        );
                      case 'stack-overflow':
                        return (
                          <StackOverflowSearchResultListItem
                            key={document.location}
                            result={document}
                            icon={<StackOverflowIcon />}
                          />
                        );
                      default:
                        return (
                          <DefaultResultListItem
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                    }
                  })}
                </List>
              )}
        </SearchResult>
    )
}

export const searchResultCustomList = <SearchResultCustomList />;