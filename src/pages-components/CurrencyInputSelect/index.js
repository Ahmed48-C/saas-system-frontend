import React from 'react';
import { TextField, MenuItem, makeStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CurrencyFlag from 'react-currency-flags';

const useStyles = makeStyles((theme) => ({
    option: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.875rem', // Adjust text size
    },
    flag: {
        marginRight: theme.spacing(2),
        transform: 'scale(1.5)', // Increase the size of the flag
    },
}));

const CurrencyInputSelect = ({ label, value, onChange, currencies }) => {
    const classes = useStyles();

    const currencyOptions = Object.keys(currencies).map((currency) => ({
        code: currency,
        name: new Intl.DisplayNames(['en'], { type: 'currency' }).of(currency),
    }));

    return (
        <Autocomplete
            options={currencyOptions}
            getOptionLabel={(option) => `${option.name} (${option.code})`}
            // renderOption={(option) => (
            //     <div className={classes.option}>
            //         <CurrencyFlag currency={option.code.toUpperCase()} size="sm" className={classes.flag} />
            //         {option.name} ({option.code})
            //     </div>
            // )}
            value={currencyOptions.find((option) => option.code === value) || null}
            onChange={(event, newValue) => {
                onChange({ target: { value: newValue ? newValue.code : '' } });
            }}
            style={{ maxHeight: '350px' }}
            renderInput={(params) => (
                <TextField {...params} label={label} variant="outlined" fullWidth />
            )}
        />
    );
};

export default CurrencyInputSelect;
