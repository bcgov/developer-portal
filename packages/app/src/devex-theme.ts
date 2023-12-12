import { BackstageOverrides } from '@backstage/core-components';
import { BackstageOverrides as CatalogReactOverrides } from '@backstage/plugin-catalog-react';
import {
  BackstageTheme,
  createTheme,
  lightTheme,
  pageTheme as defaultPageThemes,
  PageTheme,
} from '@backstage/theme';

import { alpha } from '@material-ui/core/styles';
import { AutocompleteClassKey } from '@material-ui/lab/Autocomplete';
import { AlertClassKey } from '@material-ui/lab/Alert';
import { OutlinedInputClassKey } from '@material-ui/core';
import '@bcgov/bc-sans/css/BCSans.css';

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
    fontColor: '#0E3468',
  };
});

const baseTheme = createTheme({
  palette: {
    ...lightTheme.palette,
    primary: {
      main: '#0E3468',
      light: '#4C9AFF',
      dark: '#0E3468',
    },
    secondary: {
      main: '#FF5630',
      light: '#FFAB00',
      dark: '#6554C0',
    },
    grey: {
      50: '#C1C7D0',
      100: '#7A869A',
      200: '#6B778C',
      300: '#5E6C84',
      400: '#505F79',
      500: '#42526E',
      600: '#344563',
      700: '#253858',
      800: '#0E3468',
      900: '#091E42',
    },
    error: {
      main: '#FF5630',
      light: '#FF8F73',
      dark: '#DE350B',
    },
    warning: {
      main: '#FFAB00',
      light: '#FFE380',
      dark: '#FF8B00',
    },
    success: {
      main: '#36B37E',
      light: '#79F2C0',
      dark: '#006644',
    },
    info: {
      main: '#0065FF',
      light: '#4C9AFF',
      dark: '#0747A6',
    },
    navigation: {
      ...lightTheme.palette.navigation,
      background: '#0E3468',
      color: '#FFFFFF',
      indicator: '#2684FF',
      navItem: {
        hoverBackground: 'rgba(116,118,121,0.6)',
      },
    },
    text: {
      primary: '#222222',
    },
    background: {
      default: '#FFFFFF',
    },
  },
  fontFamily: 'BCSans, Noto Sans, Roboto, sans-serif',
  pageTheme: pageThemesFontColorOverride,
  defaultPageTheme: 'home',
});

const createCustomThemeOverrides = (
  theme: BackstageTheme,
): BackstageOverrides & CatalogReactOverrides => {
  return {
    BackstageHeader: {
      header: {
        backgroundImage: 'unset',
        borderBottom: '2px solid #c7c7c7',
        boxShadow: '0 -3px 12px rgba(0,0,0,.5)',
        paddingBottom: theme.spacing(2),
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
          fill: '#FFFFFF',
        },
      },
    },
    BackstageTable: {
      root: {
        '&> :first-child': {
          borderBottom: '1px solid #D5D5D5',
          boxShadow: 'none',
        },
        '& th': {
          borderTop: 'none',
          textTransform: 'none !important',
        },
      },
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
        color: '#FFFFFF',
        backgroundColor: theme.palette.error.dark,
        '& $icon': {
          color: '#FFFFFF',
        },
      },
      standardInfo: {
        color: '#FFFFFF',
        backgroundColor: theme.palette.primary.dark,
        '& $icon': {
          color: '#FFFFFF',
        },
      },
      standardSuccess: {
        color: '#FFFFFF',
        backgroundColor: theme.palette.success.dark,
        '& $icon': {
          color: '#FFFFFF',
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
          color: '#FFFFFF',
        },
        '&[aria-expanded=true] path': {
          fill: theme.palette.primary.main,
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: '#606060'
        },
        "&:hover $notchedOutline": {
          borderColor: theme.palette.grey[50]
        },
        "&$focused $notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        '& [class^="MuiSvgIcon-root"]': {
          fill: '#606060'
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
        paddingBottom: theme.spacing(1),
        '& h3': {
          color: '#FFFFFF',
        },
        '& h4': {
          color: '#FFFFFF',
        },
        '& svg': {
          color: theme.palette.grey[50],
        },
      },
    },
    MuiChip: {
      root: {
        borderRadius: 3,
        backgroundColor: 'rgba(0, 0, 0, .11)',
        color: theme.palette.primary.dark,
        margin: 4,
      },
    },
    MuiSelect: {
      root: {
        '&[aria-expanded]': {
          backgroundColor: '#26385A',
          color: '#FFFFFF',
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
        backgroundColor: '#FFFFFF',
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
