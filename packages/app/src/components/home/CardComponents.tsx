import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  withStyles,
} from '@material-ui/core';
import { ItemCardHeader, LinkProps } from '@backstage/core-components';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import * as tokens from '@bcgov/design-tokens/js';

export const CardTitleIcon = withStyles({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.layoutMarginSmall,
    '& .icon': {
      paddingTop: tokens.layoutPaddingXsmall,
    },
  },
})(Box);

export interface CardTitleProps {
  icon: React.ReactNode;
  linkProps: LinkProps;
}

export const CardTitle = ({
  children,
  icon,
  ...props
}: PropsWithChildren<CardTitleProps>) => {
  return (
    <CardTitleIcon>
      <div className="icon">{icon}</div>
      <Link {...props.linkProps}>{children}</Link>
    </CardTitleIcon>
  );
};

export const CardLinkButton = withStyles({
  root: {
    paddingLeft: tokens.layoutPaddingNone,
    paddingRight: tokens.layoutPaddingNone,
    '& .link-text': {
      color: tokens.typographyColorLink,
      transition: 'transform .25s ease',
    },
    '& .icon': {
      fill: tokens.typographyColorLink,
      marginLeft: tokens.layoutMarginXsmall,
      transition: 'transform .25s ease',
    },
    '&:hover': {
      background: 'none',
      '& .link-text': {
        textDecoration: 'none',
        color: tokens.themeBlue80,
      },
      '& .icon': {
        transform: 'translateX(6px)',
        fill: tokens.themeBlue80,
      },
    },
  },
})(Button);

export const CardButton = ({
  children,
  ...props
}: PropsWithChildren<LinkProps>) => {
  return (
    <CardLinkButton variant="text">
      <Link className="link-text" {...props}>
        {children}
      </Link>
      <ChevronRightIcon className="icon" />
    </CardLinkButton>
  );
};

export const HomePageCardHeader = withStyles({
  root: {
    backgroundImage: 'none',
    paddingBottom: tokens.layoutPaddingNone,
  },
})(ItemCardHeader);

export const CardGroup = withStyles({
  root: {
    paddingTop: tokens.layoutMarginXxxlarge,
  },
})(Box);

export const HomePageCard = withStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    '&:hover': {
      background:
        theme.palette.type === 'dark'
          ? tokens.themeGray80
          : tokens.surfaceColorMenusHover,
    },
  },
}))(Card);

interface HomeInfoCardProps {
  icon: React.ReactNode;
  title: string;
  linkProps: LinkProps;
  description: React.ReactNode;
  buttonText: string;
  cardHeaderClass?: string;
}

export const HomeInfoCard = ({
  icon,
  title,
  linkProps,
  description,
  buttonText,
}: HomeInfoCardProps) => (
  <HomePageCard>
    <CardMedia>
      <HomePageCardHeader
        title={
          <CardTitle linkProps={linkProps} icon={icon}>
            {title}
          </CardTitle>
        }
      />
    </CardMedia>
    <CardContent>{description}</CardContent>
    <CardActions>
      <CardButton {...linkProps}>{buttonText}</CardButton>
    </CardActions>
  </HomePageCard>
);
