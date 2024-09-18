import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { TextField, Grid, Paper, Typography, InputAdornment, IconButton } from '@material-ui/core';
import CurrencyInputSelect from '../CurrencyInputSelect';
import { toast } from 'react-toastify';
import Loader from '../Loader';

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

    const handleConvert = () => {
        const rawAmount = amount.replace(/,/g, '');

        if (!rawAmount || isNaN(rawAmount)) {
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
        const result = rawAmount * rate;

        // Format result based on whether it is in scientific notation or not
        const formattedResult = formatNumber(result);

        setConvertedAmount(formattedResult);
        setLoading(false);
    };

    const formatNumber = (value) => {
        // Check if the value contains 'e' which indicates scientific notation
        if (value.toString().includes('e')) {
            // Keep scientific notation as is
            return value.toExponential(4); // Adjust precision as needed
        } else {
            // Format normally
            return new Intl.NumberFormat('en-US', {
                maximumFractionDigits: 2
            }).format(value);
        }
    };

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, ''); // Remove commas for proper number parsing
        if (isNaN(rawValue) || rawValue === '') {
            // setError('Please enter a valid number');
            setAmount('');
        } else {
            setError('');
            setAmount(formatNumber(rawValue)); // Apply formatting
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
            <Paper style={{ padding: '20px', width: '100%', maxWidth: '500px', margin: '0 auto', position: 'relative' }} elevation={3}>
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
                    <Grid item xs={12}>
                        <TextField
                            label="Amount"
                            value={amount}
                            onChange={handleAmountChange}
                            variant="outlined"
                            fullWidth
                            error={!!error}
                            helperText={error}
                            type="text" // Use text to format input
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {formatSuffix(amount.replace(/,/g, ''))}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {loading ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100px',
                                }}
                            >
                                <Loader />
                            </div>
                        ) : (
                            <Paper
                                elevation={3}
                                style={{
                                    padding: '20px',
                                    backgroundColor: 'rgba(30, 30, 30, 0.1)',
                                    height: '100px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: convertedAmount ? 'pointer' : 'default',
                                    position: 'relative',
                                }}
                                variant="outlined"
                                onClick={handleCopyToClipboard}
                            >
                                {amount && fromCurrency && toCurrency && convertedAmount && (
                                    <Typography variant="h5" style={{ textAlign: 'center', width: '100%' }}>
                                        <div>Converted Amount:</div>
                                        <div style={{ width: '100%', position: 'relative' }}>
                                            <span style={{ marginRight: 'auto' }}>{convertedAmount}</span>
                                            <span style={{ color: 'rgba(30, 30, 30, 0.4)', position: 'absolute', right: '0' }}>{toCurrency}</span>
                                        </div>
                                    </Typography>
                                )}
                                {convertedAmount && (
                                    <FileCopyIcon
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            cursor: 'pointer',
                                            color: 'rgba(30, 30, 30, 0.4)',
                                        }}
                                        fontSize="small" // Use predefined size for smaller icon
                                    />
                                )}
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
};

export default CurrencyConverter;
