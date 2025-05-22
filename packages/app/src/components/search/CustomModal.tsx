/*
 * CustomModal.tsx is a customized version of the original SearchModal.tsx
 * The searchResultCustomList component is used rather than <SearchResult> element
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

import { useCallback, useEffect, useRef } from 'react';
import {
  SearchBar,
  SearchContextProvider,
  SearchResultPager,
} from '@backstage/plugin-search-react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { searchResultCustomList } from './SearchResultCustomList';
import {
  searchPlugin,
  SearchModalChildrenProps,
  SearchModalProps,
} from '@backstage/plugin-search';
import { useNavigate } from 'react-router-dom';
import { useRouteRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  dialogTitle: {
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
  // Reduces default height of the modal, keeping a gap of 128px between the top and bottom of the page.
  paperFullWidth: { height: 'calc(100% - 128px)' },
  dialogActionsContainer: { padding: theme.spacing(1, 3) },
  viewResultsLink: { verticalAlign: '0.5em' },
}));

const rootRouteRef = searchPlugin.routes.root;

export const CustomModal = ({ toggleModal }: SearchModalChildrenProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const searchRootRoute = useRouteRef(rootRouteRef)();
  const searchBarRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    searchBarRef?.current?.focus();
  });

  // This handler is called when "enter" is pressed
  const handleSearchBarSubmit = useCallback(() => {
    toggleModal();
    // Using ref to get the current field value without waiting for a query debounce
    const query = searchBarRef.current?.value ?? '';
    navigate(`${searchRootRoute}?query=${query}`);
  }, [navigate, toggleModal, searchBarRef, searchRootRoute]);

  return (
    <>
      <DialogTitle>
        <Box className={classes.dialogTitle}>
          <SearchBar
            className={classes.input}
            inputProps={{ ref: searchBarRef }}
            onSubmit={handleSearchBarSubmit}
          />

          <IconButton aria-label="close" onClick={toggleModal}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row-reverse"
          justifyContent="flex-start"
          alignItems="center"
        >
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
        <Divider />
        <Grid container direction="column">
          <Grid item>{searchResultCustomList}</Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.dialogActionsContainer}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchResultPager />
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};

export const CustomSearchModal = (props: SearchModalProps) => {
  const { open = true, hidden, toggleModal, children } = props;

  const classes = useStyles();

  return (
    <Dialog
      classes={{
        paperFullWidth: classes.paperFullWidth,
      }}
      onClose={toggleModal}
      aria-labelledby="search-modal-title"
      fullWidth
      maxWidth="lg"
      open={open}
      hidden={hidden}
    >
      {open && (
        <SearchContextProvider inheritParentContextIfAvailable>
          {(children && children({ toggleModal })) ?? (
            <CustomModal toggleModal={toggleModal} />
          )}
        </SearchContextProvider>
      )}
    </Dialog>
  );
};
