import React from 'react';
import { SearchBar, SearchResultPager } from "@backstage/plugin-search-react";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { searchResultCustomList } from './SearchResultCustomList';


export const CustomModal = (toggleModal : any, classes : any, searchBarRef : any, handleSearchBarSubmit : any)  => {
    return (
        <>
            <DialogTitle>
                <Box className={classes.dialogTitle}>
                    <SearchBar className={classes.input}
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
                    <Grid item>
                        {searchResultCustomList}
                    </Grid>
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

export default CustomModal;