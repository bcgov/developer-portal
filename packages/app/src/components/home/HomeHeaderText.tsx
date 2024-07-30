import {Typography, withStyles} from "@material-ui/core";
import * as tokens from "@bcgov/design-tokens/js";

export const BCGovBannerText = withStyles({
    root: {
        position: 'relative',
        '&::before': {
            content: `''`,
            position: 'absolute',
            top: '-6px',
            left: '-25px',
            width: '4px',
            height: '64px',
            background: tokens.themePrimaryGold
        }, 
    }
})(Typography);

export const BCGovHeaderText = withStyles({
    root: {
        position: 'relative',
        '&::before': {
            content: `''`,
            position: 'absolute',
            top: '-10px',
            left: '0',
            width: '36px',
            height: '4px',
            background: tokens.themePrimaryGold
        }, 
    }
})(Typography);