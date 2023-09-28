import React, { PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
// import CatalogIcon from '@material-ui/icons/LocalLibrary';
// import ExtensionIcon from '@material-ui/icons/Extension';
// import MapIcon from '@material-ui/icons/MyLocation';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
// import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  // SidebarScrollWrapper,
  // SidebarSubmenu,
  // SidebarSubmenuItem,
  SidebarSpace,
  useSidebarOpenState,
  Link,
  useContent,
} from '@backstage/core-components';
// import { useApp } from '@backstage/core-plugin-api';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CustomModal from '../search/CustomModal';
import { useNavigate } from 'react-router-dom';

const storedTheme = localStorage.getItem('theme');

// Set the default theme to custom DevEx theme if no stored preference is found
const defaultTheme = 'devex';
const theme = storedTheme ?? defaultTheme;

if (storedTheme !== theme) {
  localStorage.setItem('theme', theme);
}

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 42,
    marginLeft: -10
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 20,
    marginTop: -16,
  },
});

const useModalStyles = makeStyles(theme => ({
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

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => {
  const classes = useModalStyles();
  const navigate = useNavigate();
  const searchBarRef = useRef<HTMLInputElement | null>(null);
  
  const { transitions } = useTheme();
  const { focusContent } = useContent();
  
  useEffect(() => {
      searchBarRef?.current?.focus();
  });

  const handleSearchResultClick = useCallback(() => {
    setTimeout(focusContent, transitions.duration.leavingScreen);
  }, [focusContent, transitions]);

  const handleSearchBarSubmit = useCallback(() => {
    const query = searchBarRef.current?.value ?? '';
    navigate(`/search?query=${query}`);
    handleSearchResultClick();
  }, [navigate, handleSearchResultClick]);

  return (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
      <SidebarSearchModal>
        {({ toggleModal }) => CustomModal(toggleModal, classes, searchBarRef, handleSearchBarSubmit)}
      </SidebarSearchModal>
      </SidebarGroup>
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={HomeIcon} to="/" text="Home" /> 
        {/* Global nav, not org-specific */}
        {/* <SidebarItem icon={CatalogIcon} to="catalog" text="Catalog">
          <SidebarSubmenu title="Catalog">
          <SidebarSubmenuItem
              title="APIs"
              to="catalog?filters[kind]=api"
              icon={useApp().getSystemIcon('kind:api')}
            />
            <SidebarSubmenuItem
              title="Components"
              to="catalog?filters[kind]=component"
              icon={useApp().getSystemIcon('kind:component')}
            />
            <SidebarSubmenuItem
              title="Locations"
              to="catalog?filters[kind]=location"
              icon={useApp().getSystemIcon('kind:location')}
            />
            <SidebarSubmenuItem
              title="Systems"
              to="catalog?filters[kind]=system"
              icon={useApp().getSystemIcon('kind:system')}
            />
            <SidebarSubmenuItem
              title="Templates"
              to="catalog?filters[kind]=template"
              icon={useApp().getSystemIcon('kind:api')}
            />
            <SidebarDivider />
            <SidebarSubmenuItem
              title="Groups"
              to="catalog?filters[kind]=group"
              icon={useApp().getSystemIcon('kind:group')}
            />
            <SidebarSubmenuItem
              title="Users"
              to="catalog?filters[kind]=user"
              icon={useApp().getSystemIcon('kind:user')}
            />
          </SidebarSubmenu>
        </SidebarItem>
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" /> */}
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        {/* <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." /> */}
        {/* End global nav */}
        {/* <SidebarDivider />
        <SidebarScrollWrapper>
          <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
        </SidebarScrollWrapper> */}
      </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
      <SidebarGroup
        label="Settings"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
)};
