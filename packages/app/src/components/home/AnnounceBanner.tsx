import React, { PropsWithChildren, useState } from 'react';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as tokens from '@bcgov/design-tokens/js';

const useStyles = makeStyles(theme => ({
  background: {
    display: 'flex',
    justifyContent: 'center',
    margin: `-${tokens.layoutMarginLarge} -${tokens.layoutMarginLarge} ${tokens.layoutMarginLarge}`,
    background:
      theme.palette.type === 'dark'
        ? tokens.themeGray90
        : tokens.surfaceColorBackgroundLightGray,
    boxShadow: tokens.surfaceShadowSmall,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.layoutMarginSmall,
  },
  closeBtn: {
    marginLeft: tokens.layoutMarginXxlarge,
  },
}));

interface AnnounceBannerProps {
  id: number; // increment the element's id for new announcements
  title: string;
}

export const AnnounceBanner = ({
  children,
  ...props
}: PropsWithChildren<AnnounceBannerProps>) => {
  const classes = useStyles();
  const bannerStateId = localStorage.getItem('announceBannerStateId');
  // show the banner if announceBannerStateId is unset, or for a previous announcement
  const [isOpen, setIsOpen] = useState(
    !bannerStateId || +bannerStateId < props.id,
  );

  if (!isOpen) return null;

  const closeBanner = () => {
    localStorage.setItem('announceBannerStateId', `${props.id}`);
    setIsOpen(false);
  };

  return (
    <div className={classes.background}>
      <div className={classes.content}>
        <Typography variant="h6">{props.title}</Typography>
        {children}
        <IconButton
          className={classes.closeBtn}
          onClick={closeBanner}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
};
