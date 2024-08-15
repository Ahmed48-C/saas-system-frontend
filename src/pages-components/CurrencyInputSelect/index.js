import React from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const CurrencyInputSelect = ({ label, value, onChange, currencies }) => {

    const currencyOptions = Object.keys(currencies).map((currency) => ({
        code: currency,
        name: new Intl.DisplayNames(['en'], { type: 'currency' }).of(currency),
    }));

    return (
        <Autocomplete
            options={currencyOptions}
            getOptionLabel={(option) => `${option.name} (${option.code})`}
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
