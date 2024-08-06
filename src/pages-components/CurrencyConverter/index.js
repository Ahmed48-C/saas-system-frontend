import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { TextField, Button, Grid, Paper, Typography, InputAdornment, IconButton } from '@material-ui/core';
import Loader from '../Loader';
import CurrencyInputSelect from '../CurrencyInputSelect';
import { toast } from 'react-toastify';

const API_KEY = '2f5ecdd5c54ae1e0090f9be2'; // Replace with your actual API key
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

const CurrencyConverter = () => {
    const [currencies, setCurrencies] = useState(JSON.parse(localStorage.getItem('currencies')) || {});
    const [fromCurrency, setFromCurrency] = useState(localStorage.getItem('fromCurrency') || 'AED');
    const [toCurrency, setToCurrency] = useState(localStorage.getItem('toCurrency') || 'USD');
    const [amount, setAmount] = useState(localStorage.getItem('amount') || '');
    const [convertedAmount, setConvertedAmount] = useState(localStorage.getItem('convertedAmount') || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCurrencies = () => {
            setLoading(true);
            axios.get(`${API_URL}USD`) // Fetching USD as a base
                .then(response => {
                    const data = response.data;
                    setCurrencies(data.conversion_rates);
                    localStorage.setItem('currencies', JSON.stringify(data.conversion_rates));
                    setLoading(false);
                })
                .catch(error => {
                    setError('Failed to fetch currencies');
                    setLoading(false);
                });
        };

        fetchCurrencies();
    }, []);

    useEffect(() => {
        localStorage.setItem('fromCurrency', fromCurrency);
    }, [fromCurrency]);

    useEffect(() => {
        localStorage.setItem('toCurrency', toCurrency);
    }, [toCurrency]);

    useEffect(() => {
        localStorage.setItem('amount', amount);
    }, [amount]);

    useEffect(() => {
        localStorage.setItem('convertedAmount', convertedAmount);
    }, [convertedAmount]);

    useEffect(() => {
        // Clear converted amount if any of these fields are empty
        if (!fromCurrency || !toCurrency || !amount) {
            setConvertedAmount('');
        } else {
            handleConvert();
        }
    }, [fromCurrency, toCurrency, amount]);

    const formatSuffix = (value) => {
        if (value >= 1e15) {
            return 'Qd';
        } else if (value >= 1e12) {
            return 'T';
        } else if (value >= 1e9) {
            return 'B';
        } else if (value >= 1e6) {
            return 'M';
        } else if (value >= 1e3) {
            return 'K';
        }
        return '';
    };

    const suffix = formatSuffix(amount);

    const handleConvert = () => {
        if (!amount || isNaN(amount)) {
            setError('Please enter a valid number');
            setConvertedAmount('');
            return;
        }
        if (!currencies[fromCurrency] || !currencies[toCurrency]) {
            setConvertedAmount('');
            return;
        }

        setLoading(true);
        const rate = currencies[toCurrency] / currencies[fromCurrency];
        const result = amount * rate;
        setConvertedAmount(result.toFixed(4));
        setLoading(false);
    };

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const handleAmountChange = (e) => {
        if (isNaN(e.target.value)) {
            setError('Please enter a valid number');
        } else {
            setError('');
            setAmount(e.target.value);
        }
    };

    const handleCopyToClipboard = () => {
        if (convertedAmount) {
            navigator.clipboard.writeText(convertedAmount)
                .then(() => {
                    toast.success('Copied to Clipboard');
                    toast.clearWaitingQueue();
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        }
    };

    return (
        <>
            <Paper style={{ padding: '20px', width: '100%', maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={5}>
                        <CurrencyInputSelect
                            label="From"
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            currencies={currencies}
                        />
                    </Grid>
                    <Grid item xs={12} md={2} style={{ textAlign: 'center' }}>
                        <IconButton onClick={handleSwap}>
                            <SwapHorizIcon fontSize="large" />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <CurrencyInputSelect
                            label="To"
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            currencies={currencies}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Amount"
                            value={amount}
                            onChange={handleAmountChange}
                            variant="outlined"
                            fullWidth
                            error={!!error}
                            helperText={error}
                            type="number"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {suffix}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConvert}
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <Loader /> : 'Convert'}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper
                            elevation={3}
                            style={{
                                padding: '20px',
                                backgroundColor: 'rgba(30, 30, 30, 0.1)',
                                height: '100px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: convertedAmount ? 'pointer' : 'default',
                                position: 'relative',
                            }}
                            variant="outlined"
                            onClick={handleCopyToClipboard}
                        >
                            {amount && fromCurrency && toCurrency && convertedAmount && (
                                <Typography variant="h5" style={{ textAlign: 'center' }}>
                                    Converted Amount: {convertedAmount} {toCurrency}
                                </Typography>
                            )}
                            {convertedAmount && (
                                <FileCopyIcon
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        cursor: 'pointer',
                                        color: 'rgba(30, 30, 30, 0.4)'
                                    }}
                                    fontSize="small" // Use predefined size for smaller icon
                                    // onClick={handleCopyToClipboard}
                                />
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
};

export default CurrencyConverter;
