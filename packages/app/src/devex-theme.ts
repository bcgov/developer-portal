import { BackstageOverrides } from '@backstage/core-components';
import { BackstageOverrides as CatalogReactOverrides } from '@backstage/plugin-catalog-react';
import {
  BackstageTheme,
  createTheme,
  lightTheme,
  pageTheme as defaultPageThemes,
  PageTheme,
  genPageTheme,
  shapes,
} from '@backstage/theme';

import { alpha } from '@material-ui/core/styles';
import { AutocompleteClassKey } from '@material-ui/lab/Autocomplete';
import { AlertClassKey } from '@material-ui/lab/Alert';
import { OutlinedInputClassKey } from '@material-ui/core';
import '@bcgov/bc-sans/css/BCSans.css';
import * as tokens from "@bcgov/design-tokens/js";

// Labs types not included in overrides; https://github.com/mui/material-ui/issues/19427
declare module '@material-ui/core/styles/overrides' {
  export interface ComponentNameToClassKey {
    MuiAlert: AlertClassKey;
    MuiAutocomplete: AutocompleteClassKey;
    MuiOutlinedInput: OutlinedInputClassKey;
  }
}

const baseTheme = createTheme({
  palette: {
    ...lightTheme.palette,
    primary: {
      main: tokens.themePrimaryBlue,
      light: tokens.themeBlue60, // this is a graph node color for catalog components
      dark: tokens.themePrimaryBlue,
    },
    secondary: {
      main: tokens.themePrimaryGold,
      light: tokens.themePrimaryGold, // this is a graph node color for catalog components
      dark: tokens.surfaceColorBorderActive,
    },
    grey: {
      50: tokens.themeGray10,
      100: tokens.themeGray20,
      200: tokens.themeGray30,
      300: tokens.themeGray40,
      400: tokens.themeGray50,
      500: tokens.themeGray60,
      600: tokens.themeGray70,
      700: tokens.themeGray80,
      800: tokens.themeGray90,
      900: tokens.themeGray100,
    },
    error: {
      main: tokens.iconsColorDanger,
      light: tokens.supportSurfaceColorDanger,
      dark: '#DE350B',
    },
    warning: {
      main: tokens.iconsColorWarning,
      light: tokens.supportSurfaceColorWarning,
      dark: '#FF8B00',
    },
    success: {
      main: tokens.iconsColorSuccess,
      light: tokens.supportSurfaceColorSuccess,
      dark: '#006644',
    },
    info: {
      main: tokens.iconsColorInfo,
      light: tokens.supportSurfaceColorInfo,
      dark: '#0747A6',
    },
    navigation: {
      ...lightTheme.palette.navigation,
      background: tokens.themePrimaryBlue,
      color: tokens.typographyColorPrimaryInvert,
      indicator: tokens.themePrimaryGold,
      navItem: {
        hoverBackground: tokens.surfaceColorPrimaryButtonHover,
      },
    },
    text: {
      primary: tokens.themeGray110,
    },
    background: {
      default: tokens.surfaceColorBackgroundWhite,
    },
  },
  fontFamily: 'BCSans, Noto Sans, Roboto, sans-serif',
  // Generate page header + font color & card header. Currently we have page header backgrounds turned off
  // HomePage card header backgrounds are also turned off, so this mainly controls page header font color
  // and the card headers on /create
  pageTheme: {
    // set all the builtin page themes to the same header background and font color
    ...Object.keys(defaultPageThemes).reduce((acc: {[key: string]: PageTheme}, themeName) => {
        acc[themeName] = genPageTheme({
          colors: [ tokens.themeGray30, tokens.surfaceColorBackgroundWhite ],
          shape: shapes.round,
          options: { fontColor: tokens.themePrimaryBlue },
        });
        return acc;
    }, {}),
  },
  defaultPageTheme: 'home',
});

const createCustomThemeOverrides = (
  theme: BackstageTheme,
): BackstageOverrides & CatalogReactOverrides => {
  return {
    BackstageHeader: {
      header: {
        backgroundImage: 'unset',
        borderBottom: `${tokens.layoutBorderWidthMedium} solid ${tokens.surfaceColorBorderDefault}`,
        boxShadow: tokens.surfaceShadowSmall,
        paddingBottom: tokens.layoutPaddingMedium,
        '& h1': {
          fontSize: '1.5rem',
        },
      },
      title: {
        color: theme.page.fontColor,
        fontWeight: 900,
      },
      subtitle: {
        color: alpha(theme.page.fontColor, 0.9),
      },
      type: {
        color: alpha(theme.page.fontColor, 0.9),
      },
    },
    BackstageHeaderLabel: {
      label: {
        color: theme.page.fontColor,
      },
      value: {
        color: alpha(theme.page.fontColor, 0.9),
      },
    },
    BackstageHeaderTabs: {
      defaultTab: {
        fontSize: 'inherit',
        textTransform: 'none',
      },
    },
    BackstageOpenedDropdown: {
      icon: {
        '& path': {
          fill: tokens.iconsColorPrimaryInvert,
        },
      },
    },
    BackstageTable: {
      root: {
        '&> :first-child': {
          borderBottom: `${tokens.layoutBorderWidthSmall} solid ${tokens.surfaceColorBorderDefault}`,
          boxShadow: 'none',
        },
        '& th': {
          borderTop: 'none',
          textTransform: 'none !important',
        },
      },
    },
    BackstageItemCardHeader: {
        root: {
          padding: `${tokens.layoutPaddingLarge} ${tokens.layoutPaddingLarge} calc(${tokens.layoutPaddingLarge} / 2)`,
      }
    },
    CatalogReactUserListPicker: {
      title: {
        textTransform: 'none',
      },
    },
    MuiAlert: {
      root: {
        borderRadius: tokens.layoutBorderRadiusNone,
      },
      standardError: {
        color: tokens.typographyColorPrimaryInvert,
        backgroundColor: theme.palette.error.dark,
        '& $icon': {
          color: tokens.iconsColorPrimaryInvert,
        },
      },
      standardInfo: {
        color: tokens.typographyColorPrimaryInvert,
        backgroundColor: theme.palette.primary.dark,
        '& $icon': {
          color: tokens.iconsColorPrimaryInvert,
        },
      },
      standardSuccess: {
        color: tokens.typographyColorPrimaryInvert,
        backgroundColor: theme.palette.success.dark,
        '& $icon': {
          color: tokens.iconsColorPrimaryInvert,
        },
      },
      standardWarning: {
        color: theme.palette.grey[800],
        backgroundColor: theme.palette.secondary.light,
        '& $icon': {
          color: theme.palette.grey[800],
        },
      },
    },
    MuiAutocomplete: {
      root: {
        '&[aria-expanded=true]': {
          color: tokens.typographyColorPrimaryInvert,
        },
        '&[aria-expanded=true] path': {
          fill: theme.palette.primary.main,
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: tokens.surfaceColorBackgroundDarkBlue,
        },
        "&$focused $notchedOutline": {
          borderColor: tokens.surfaceColorBorderActive,
        },
        '& svg': {
          fill: tokens.themeGray80,
        }
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: 'rgba(9,30,69,0.54)',
      },
    },
    MuiButton: {
      root: {
        borderRadius: tokens.layoutBorderRadiusMedium,
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
      },
    },
    MuiCard: {
      root: {
        backgroundImage: 'unset',
        borderRadius: tokens.layoutBorderRadiusMedium,
        boxShadow: tokens.surfaceShadowSmall,
        '& h3': {
          color: tokens.typographyColorPrimary,
        },
        '& h4': {
          color: tokens.typographyColorPrimary,
        },
        '&:hover': {
          boxShadow: tokens.surfaceShadowMedium,
        },
        '& svg': {
          color: tokens.themeGray80,
        },
      },
    },
    MuiCardContent: {
      root: {
        padding: `${tokens.layoutPaddingMedium} ${tokens.layoutPaddingLarge} 0`,
      }
    },
    MuiCardActions: {
      root: {
        // /create cards have 16px padding on CardActions regardless of what's specified here
        // so setting all to 16px (layoutPaddingMedium), and use margin to reach desired layoutPaddingLarge value
        padding: tokens.layoutPaddingMedium,
        margin: `${tokens.layoutMarginNone} ${tokens.layoutMarginSmall} ${tokens.layoutMarginSmall}`
      }
    },
    MuiChip: {
      root: {
        borderRadius: tokens.layoutBorderRadiusMedium,
        backgroundColor: 'rgba(0, 0, 0, .11)',
        color: theme.palette.primary.dark,
        margin: tokens.layoutMarginXsmall,
      },
    },
    MuiSelect: {
      root: {
        '&[aria-expanded]': {
          backgroundColor: tokens.surfaceColorBackgroundDarkBlue,
          color: tokens.typographyColorPrimaryInvert,
        },
      },
    },
    MuiSwitch: {
      root: {
        padding: 10,
      },
      switchBase: {
        padding: 12,
      },
      thumb: {
        backgroundColor: tokens.surfaceColorBackgroundWhite,
        height: 14,
        width: 14,
      },
      track: {
        borderRadius: 9,
      },
    },
    MuiTabs: {
      indicator: {
        transition: 'none',
      },
    },
    MuiTypography: {
      button: {
        textTransform: 'none',
      },
    },
  };
};

export const devExTheme: BackstageTheme = {
  ...baseTheme,
  overrides: {
    ...baseTheme.overrides,
    ...createCustomThemeOverrides(baseTheme),
  },
};
