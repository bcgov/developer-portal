import React, { PropsWithChildren, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
// import CatalogIcon from '@material-ui/icons/LocalLibrary';
// import ExtensionIcon from '@material-ui/icons/Extension';
// import MapIcon from '@material-ui/icons/MyLocation';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CloudOff from '@material-ui/icons/CloudOff';
// import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
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
import { CustomSearchModal } from '../search/CustomModal';

import {useApi, configApiRef} from '@backstage/core-plugin-api';


// snowplow analytics
import {newTracker, trackPageView, enableActivityTracking} from '@snowplow/browser-tracker';
import {
    enableLinkClickTracking,
    refreshLinkClickTracking,
    LinkClickTrackingPlugin as linkTrackingPlugin
} from '@snowplow/browser-plugin-link-click-tracking';
import {useLocation} from "react-router-dom";


const MyReactComponent = () => {
    const config = useApi(configApiRef);

    const location = useLocation();

    // refresh link tracking whenever local navigation occurs
    useEffect(() => {
      setTimeout(refreshLinkClickTracking, 250);
    }, [location]);

    console.log("**********Setting up analytics (or not...)********");
    console.log(`Config: ${JSON.stringify(config)}`);

    if (config.getOptionalConfig('app.analytics') && config.getBoolean('app.analytics.snowplow.enabled')) {
        console.log("**********Analytics enabled...********");

        // const collectorUrl = "spm.apps.gov.bc.ca"
        const collectorUrl = config.getString("app.analytics.snowplow.collectorUrl");

        newTracker('rt', `${collectorUrl}`, {
            appId: 'Snowplow_standalone_OCIO',
            cookieLifetime: 86400 * 548,
            platform: "web",
            contexts: {
                webPage: true
            },
            plugins: [linkTrackingPlugin()]
        });

        enableActivityTracking({
            minimumVisitLength: 30,
            heartbeatDelay: 30
        });

        enableLinkClickTracking();

        trackPageView();
    }
    return null;
}


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
  const { state, toggleModal } = useSearchModal();

  return (
  <SidebarPage>
        <MyReactComponent/>
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
        <CustomSearchModal
          {...state}
          toggleModal={toggleModal}
        />
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
        label="Offsite Links"
        // icon={<UserSettingsSignInAvatar />}
      >
        <SidebarItem icon={CloudOff} to="https://developer.gov.bc.ca" text="Legacy Site" />
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
)};
