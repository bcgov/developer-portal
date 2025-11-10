import { List } from '@material-ui/core';
import {
  SearchResult,
  DefaultResultListItem,
} from '@backstage/plugin-search-react';

import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
import { GithubDiscussionsSearchResultListItem } from '@backstage-community/plugin-github-discussions';
import { CatalogIcon, DocsIcon, GitHubIcon } from '@backstage/core-components';
import { TechDocsSearchResultCustomListItem } from './TechDocsSearchResultCustomListItem';
import { ResultHighlight } from '@backstage/plugin-search-common';

interface SearchResultItem {
  type: string;
  document: any;
  highlight?: ResultHighlight;
  rank?: number;
}

export const SearchResultCustomList = () => {
  return (
    <SearchResult>
      {({ results }) => (
        <List>
          {results.map((result: SearchResultItem) => {
            const { type, document, highlight, rank } = result;
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
                    asListItem
                    icon={<DocsIcon />}
                  />
                );
              case 'github-discussions':
                return (
                  <GithubDiscussionsSearchResultListItem
                    key={document.location}
                    result={document}
                    highlight={highlight}
                    rank={rank}
                    icon={<GitHubIcon />}
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
  );
};
