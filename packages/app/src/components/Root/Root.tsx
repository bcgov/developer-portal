import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
// import CatalogIcon from '@material-ui/icons/LocalLibrary';
// import ExtensionIcon from '@material-ui/icons/Extension';
// import MapIcon from '@material-ui/icons/MyLocation';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import LaunchIcon from '@material-ui/icons/Launch';
// import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import LogoFull from './LogoFull';
import { LogoIcon } from './LogoIcon';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SearchModalProvider, useSearchModal } from '@backstage/plugin-search';
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
} from '@backstage/core-components';
// import { useApp } from '@backstage/core-plugin-api';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import { CustomSearchModal } from '../search/CustomModal';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

const storedTheme = localStorage.getItem('theme');

// Set the default theme to custom DevEx theme if no stored preference is found
const defaultTheme = 'devex';
const theme = storedTheme ?? defaultTheme;

if (storedTheme !== theme) {
  localStorage.setItem('theme', theme);
}

// Similarly, default the sidebar pinned state to false if no stored pref is found
if (!localStorage.getItem('sidebarPinState')) {
  localStorage.setItem('sidebarPinState', 'false');
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
    marginLeft: -10,
  },
  linkOpen: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 20,
    marginTop: -16,
  },
  linkClose: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 14,
    marginTop: -5,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link
        to="/"
        underline="none"
        className={isOpen ? classes.linkOpen : classes.linkClose}
        aria-label="Home"
      >
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => {
  const { state, toggleModal } = useSearchModal();
  const config = useApi(configApiRef);
  const wizardsEnabled =
    config.getOptionalConfig('app.wizards') &&
    config.getBoolean('app.wizards.enabled');

  return (
    <SidebarPage>
      <Sidebar>
        <SidebarLogo />
        <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
          <SearchModalProvider>
            <SidebarItem
              className="search-icon"
              icon={SearchIcon}
              text="Search"
              onClick={toggleModal}
            />
            <CustomSearchModal {...state} toggleModal={toggleModal} />
          </SearchModalProvider>
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
          {wizardsEnabled ? (
            <SidebarItem icon={LibraryAddIcon} to="create" text="Wizards" />
          ) : null}
          {/* <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." /> */}
          {/* End global nav */}
          {/* <SidebarDivider />
        <SidebarScrollWrapper>
          <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
        </SidebarScrollWrapper> */}
        </SidebarGroup>
        <SidebarSpace />
        <SidebarGroup label="Offsite Links">
          <SidebarItem
            icon={LaunchIcon}
            to="https://classic.developer.gov.bc.ca"
            text="Classic DevHub"
          />
        </SidebarGroup>
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
  );
};
