import { lighten, makeStyles } from '@material-ui/core';

export const selectedRowStyles = makeStyles((theme) => ({
    highlight:
        theme.palette.type === 'light'
        ? {
            // color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
            // color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
        },
}));