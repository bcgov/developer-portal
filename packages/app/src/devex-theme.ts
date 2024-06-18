import { BackstageOverrides } from '@backstage/core-components';
import { BackstageOverrides as CatalogReactOverrides } from '@backstage/plugin-catalog-react';
import {
  BackstageTheme,
  createTheme,
  lightTheme,
  pageTheme as defaultPageThemes,
  PageTheme,
  genPageTheme,
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

const pageThemesFontColorOverride: Record<string, PageTheme> = {};
Object.keys(defaultPageThemes).map(key => {
  pageThemesFontColorOverride[key] = {
    ...defaultPageThemes[key],
    fontColor: tokens.typographyColorPrimary,
  };
});

const baseTheme = createTheme({
  palette: {
    ...lightTheme.palette,
    primary: {
      main: tokens.themePrimaryBlue,
      light: tokens.themeBlue60,
      dark: tokens.themePrimaryBlue,
    },
    secondary: { // I dont think I get these color selections
      main: tokens.supportSurfaceColorDanger,
      light: tokens.themePrimaryGold,
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
      main: '#CE3E39',
      light: tokens.supportSurfaceColorDanger,
      dark: '#A2312D',
    },
    warning: {
      main: '#F8BB47',
      light: tokens.supportSurfaceColorWarning,
      dark: tokens.themeGold100,
    },
    success: {
      main: '#42814A',
      light: tokens.supportSurfaceColorSuccess,
      dark: '#006644',
    },
    info: {
      main: '#053662',
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
  pageTheme: {
    ...pageThemesFontColorOverride,
    documentation: genPageTheme({
        colors: [tokens.surfaceColorBackgroundWhite],
        shape: 'none',
    })
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
        color: alpha(theme.page.fontColor, 0.8),
      },
      type: {
        color: alpha(theme.page.fontColor, 0.8),
      },
    },
    BackstageHeaderLabel: {
      label: {
        color: theme.page.fontColor,
      },
      value: {
        color: alpha(theme.page.fontColor, 0.8),
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
          // color: tokens.typographyColorLink,
          backgroundImage: 'none',
          paddingBottom: 0,
      //   '&:hover': {
      //     background: tokens.surfaceColorMenusHover,
      // }
    }
    },
    CatalogReactUserListPicker: {
      title: {
        textTransform: 'none',
      },
    },
    MuiAlert: {
      root: {
        borderRadius: 0,
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
        color: theme.palette.grey[700],
        backgroundColor: theme.palette.secondary.light,
        '& $icon': {
          color: theme.palette.grey[700],
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
          borderColor: tokens.surfaceColorBorderDefault,
        },
        "&$focused $notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        '& [class^="MuiSvgIcon-root"]': {
          fill: tokens.iconsColorSecondary,
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
        borderRadius: 3,
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
      },
    },
    MuiCard: {
      root: {
        backgroundImage: 'unset',
        paddingBottom: tokens.layoutPaddingSmall,
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
        '& svg': { // also the searchPage drop down icons
          color: tokens.themeGray80,
        },
        '& button[aria-label="favorite"]': {
          '& svg': {
            color: tokens.iconsColorPrimary,
            background: 'inherit',
          },
        },
      },
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
        padding: tokens.layoutPaddingSmall,
      },
      switchBase: {
        padding: tokens.layoutPaddingMedium,
      },
      thumb: {
        backgroundColor: tokens.surfaceColorBackgroundWhite,
        height: 14,
        width: 14,
      },
      track: {
        borderRadius: tokens.layoutBorderRadiusLarge,
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
