import React, { useEffect } from 'react';
import { useLocalStorageValue } from '@react-hookz/web';
import { makeStyles, withStyles } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

const TOC_LIST = 'ul[data-md-component="toc"]';

const EXPANDABLE_TOC_LOCAL_STORAGE =
  '@backstage/techdocs-addons/toc-expanded';

const useStyles = makeStyles({
  span: {
    position: 'absolute',
    left: '220px',
    top: '19px',
    padding: 0,
    minWidth: 0,
  },
});

const ExpandedIcon = withStyles({
  root: {
    height: '20px',
    width: '20px',
    transition: 'transform .25s'
  },
})(ChevronRightIcon);

type expandableTocLocalStorage = {
  expandToc: boolean;
};

/**
 * Show expand/collapse button next to ToC header
 */
export const ExpandableTocAddon = () => {
    const classes = useStyles();
    const defaultValue = { expandToc: false };
    const { value: expanded, set: setExpanded } =
    useLocalStorageValue<expandableTocLocalStorage>(
        EXPANDABLE_TOC_LOCAL_STORAGE,
        { defaultValue },
    );

    const tocList = useShadowRootElements<HTMLUListElement>([TOC_LIST]);
    const isEmpty = (tocList.length === 0);

    useEffect(() => {
    tocList.forEach(match => {
      match.style.display = expanded?.expandToc ? 'block' : 'none';
    });
    }, [expanded, tocList]);

    const handleState = () => {
        setExpanded(prevState => ({
            expandToc: !prevState?.expandToc,
        }));
    };

    return (
        <>
            { !isEmpty ? (
                <span
                    className={classes.span}
                    onClick={handleState}
                    onKeyDown={handleState}
                    aria-label={expanded?.expandToc ? 'collapse-toc' : 'expand-toc'}
                >
                    <ExpandedIcon 
                      style={{ transform: expanded?.expandToc ? 'rotate(90deg)' : 'rotate(0)' }} 
                      cursor='pointer'
                    />
                </span>
            ) : null}
        </>
    );
};