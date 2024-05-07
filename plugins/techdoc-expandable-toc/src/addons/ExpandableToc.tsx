import React, { useEffect } from 'react';
import { useLocalStorageValue } from '@react-hookz/web';
import { Button, withStyles } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

const TOC_LIST = 'ul[data-md-component="toc"]>li';

const EXPANDABLE_TOC_LOCAL_STORAGE =
  '@backstage/techdocs-addons/toc-expanded';

const StyledButton = withStyles({
  root: {
    position: 'absolute',
    left: '220px',
    top: '19px',
    padding: 0,
    minWidth: 0,
  },
})(Button);

const CollapsedIcon = withStyles({
  root: {
    height: '20px',
    width: '20px',
  },
})(ChevronRightIcon);

const ExpandedIcon = withStyles({
  root: {
    height: '20px',
    width: '20px',
  },
})(ExpandMoreIcon);

type expandableTocLocalStorage = {
  expandToc: boolean;
};

/**
 * Show expand/collapse button next to ToC header
 */
export const ExpandableTocAddon = () => {
    const defaultValue = { expandToc: false };
    const { value: expanded, set: setExpanded } =
    useLocalStorageValue<expandableTocLocalStorage>(
        EXPANDABLE_TOC_LOCAL_STORAGE,
        { defaultValue },
    );

    const tocList = useShadowRootElements<HTMLLIElement>([TOC_LIST]);
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
                <StyledButton
                    size="small"
                    onClick={handleState}
                    aria-label={expanded?.expandToc ? 'collapse-toc' : 'expand-toc'}
                >
                    {expanded?.expandToc ? <ExpandedIcon /> : <CollapsedIcon />}
                </StyledButton>
            ) : null }
        </>
    );
};