import React, { useCallback, useEffect, useRef } from 'react';
import { Box, Button, Divider, Grid, Theme, Typography, makeStyles, useTheme } from '@material-ui/core';
import { Content, Page } from '@backstage/core-components';
import { SearchBar, SearchContextProvider, SearchPagination } from '@backstage/plugin-search-react';
import { searchPlugin } from '@backstage/plugin-search';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { searchResultCustomList } from '../search/SearchResultCustomList';
import { useRouteRef } from '@backstage/core-plugin-api';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles(theme => ({
  title: {
    gap: theme.spacing(1),
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr auto',
    '&> button': {
      marginTop: theme.spacing(1),
    },
  },
  input: {
    flex: 1,
  },
  button: {
    '&:hover': {
      background: 'none',
    },
  },
}));

const rootRouteRef = searchPlugin.routes.root;

export function Custom404Page() {
  const classes = useStyles();
  const theme: Theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRootRoute = useRouteRef(rootRouteRef)();
  const searchBarRef = useRef<HTMLInputElement | null>(null);

  // grab the url slug
  const pagePath = location.pathname.split('/').pop();

  const preFiltered = {
    term: pagePath?.replaceAll('-', ' ')?.replaceAll('_', ' ') ?? '',
    types: [],
    filters: {},
  };

  useEffect(() => {
    searchBarRef?.current?.focus();
  });

  // This handler is called when "enter" is pressed
  const handleSearchBarSubmit = useCallback(() => {
    // Using ref to get the current field value without waiting for a query debounce
    const query = preFiltered.term;
    navigate(`${searchRootRoute}?query=${query}`);
  }, [navigate, searchBarRef]);

  return (
    <Page themeId="home">
      <Content>
        <SearchContextProvider initialState={preFiltered}>
          <Box padding="calc(2.1rem - 24px) 9%">
            <Typography variant="h1">Page not found</Typography>
            <Divider orientation="horizontal" variant="middle" />
            <Box pt={3}>
              <Typography variant="h6"><Link style={{color: theme.palette.primary.main}} to="#" onClick={() => navigate(-1)}>Go back</Link> or <Link style={{color: theme.palette.primary.main}} to={`https://classic.developer.gov.bc.ca/?q=${preFiltered.term}`}>Search Classic DevHub</Link> - please <Link style={{color: theme.palette.primary.main}} to="https://github.com/bcgov/developer-portal/issues">contact support</Link> if you think this is a bug</Typography>
            </Box>

            <Box pt={3} className={classes.title}>
              <SearchBar
                className={classes.input}
                inputProps={{ ref: searchBarRef }}
                onSubmit={handleSearchBarSubmit}
              />
            </Box>

            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <SearchPagination />
              </Grid>
              <Grid item>
                <Button
                  className={classes.button}
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleSearchBarSubmit}
                  disableRipple
                >
                  View Full Results
                </Button>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item xs={9}>
                {searchResultCustomList}
              </Grid>
            </Grid>

          </Box>
        </SearchContextProvider>
      </Content>
    </Page>
  );
}