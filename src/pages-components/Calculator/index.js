import React, { useState } from 'react';
import { Paper, TextField, Button, Grid } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';

const Calculator = () => {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');

    const handleButtonClick = (value) => {
        setExpression((prev) => prev + value);
    };

    const handleClear = () => {
        setExpression('');
        setResult('');
    };

    const handleDelete = () => {
        setExpression((prev) => prev.slice(0, -1));
    };

    const handleCalculate = () => {
        try {
            const evalResult = eval(expression.replace(/,/g, '')); // Remove commas before evaluation
            setResult(evalResult.toLocaleString()); // Format result with commas
        } catch (error) {
            setResult('Error');
        }
    };

    const handlePercentage = () => {
        try {
            const evalResult = eval(expression.replace(/,/g, '')) / 100; // Calculate percentage
            setExpression(evalResult.toString()); // Set expression to result
        } catch (error) {
            setExpression('Error');
        }
    };

    const formatExpression = (expr) => {
        return expr.replace(/\d+/g, (match) => {
            return parseInt(match, 10).toLocaleString();
        });
    };

    return (
        <Paper style={{ padding: '20px', width: '100%', maxWidth: '350px', margin: '0 auto', position: 'relative' }} elevation={3}>
            <TextField
                label="Expression"
                value={formatExpression(expression)}
                variant="outlined"
                fullWidth
                InputProps={{
                    readOnly: true,
                }}
                style={{ marginBottom: '20px' }}
            />
            <TextField
                label="Result"
                value={result}
                variant="outlined"
                fullWidth
                InputProps={{
                    readOnly: true,
                }}
                style={{ marginBottom: '20px' }}
            />
            <Grid container spacing={1}>
                {['7', '8', '9', '/'].map((value) => (
                    <Grid item xs={3} key={value}>
                        <Button variant="contained" color="primary" fullWidth onClick={() => handleButtonClick(value)} style={{ height: '100%' }}>
                            {value}
                        </Button>
                    </Grid>
                ))}
                {['4', '5', '6', '*'].map((value) => (
                    <Grid item xs={3} key={value}>
                        <Button variant="contained" color="primary" fullWidth onClick={() => handleButtonClick(value)} style={{ height: '100%' }}>
                            {value}
                        </Button>
                    </Grid>
                ))}
                {['1', '2', '3', '-'].map((value) => (
                    <Grid item xs={3} key={value}>
                        <Button variant="contained" color="primary" fullWidth onClick={() => handleButtonClick(value)} style={{ height: '100%' }}>
                            {value}
                        </Button>
                    </Grid>
                ))}
                {['0', '.', '%', '+'].map((value) => (
                    <Grid item xs={3} key={value}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                if (value === '%') {
                                    handlePercentage();
                                } else {
                                    handleButtonClick(value);
                                }
                            }}
                            style={{ height: '100%' }}
                        >
                            {value}
                        </Button>
                    </Grid>
                ))}
                <Grid item xs={6}>
                    <Button variant="contained" color="secondary" fullWidth onClick={handleClear}>
                        Clear
                    </Button>
                </Grid>
                <Grid item xs={3}>
                <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleDelete}
                        style={{ height: '100%' }}
                    >
                        <BackspaceIcon fontSize="small" />
                    </Button>
                </Grid>
                <Grid item xs={3}>
                    <Button variant="contained" color="warning" fullWidth onClick={handleCalculate}>
                        =
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Calculator;
