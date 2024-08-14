import React, { useState } from 'react';
import { Paper, TextField, Button, Grid } from '@material-ui/core';

// Button values for the calculator layout
const btnValues = [
    ['C', '+-', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
];

// Utility functions for calculations
const toLocaleString = (num) =>
    String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');

const removeSpaces = (num) =>
    num.toString().replace(/\s/g, '');

const calculate = (a, b, sign) => {
    switch (sign) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : "Can't divide by 0";
        default: return b;
    }
};

const Calculator = () => {
    const [calc, setCalc] = useState({
        sign: '',
        num: '',
        res: '',
    });

    // Handler functions for each button press
    const handleButtonClick = (btn) => {
        // Clear NaN error when any button is pressed
        if (calc.res === "NaN") {
            resetCalc();
        }

        if (btn === 'C' || calc.res === "Can't divide by 0") {
            resetCalc();
        } else if (btn === '+-') {
            invertNumber();
        } else if (btn === '%') {
            applyPercent();
        } else if (btn === '=') {
            evaluateResult();
        } else if (['/', '*', '-', '+'].includes(btn)) {
            chooseSign(btn);
        } else if (btn === '.') {
            addDecimal();
        } else {
            appendNumber(btn);
        }
    };

    // Update the number on the display
    const appendNumber = (num) => {
        if (removeSpaces(calc.num).length < 16) {
            const updatedNum = calc.num === '0' && num === '0' ? '0' :
                toLocaleString(removeSpaces(calc.num + num));

            setCalc({
                ...calc,
                num: updatedNum,
                res: calc.sign ? calc.res : '',
            });
        }
    };

    const addDecimal = () => {
        if (!calc.num.includes('.')) {
            setCalc({
                ...calc,
                num: calc.num + '.',
            });
        }
    };

    const chooseSign = (sign) => {
        setCalc({
            ...calc,
            sign,
            res: calc.num && calc.res
                ? toLocaleString(calculate(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)), calc.sign))
                : calc.num || calc.res,
            num: '',
        });
    };

    const evaluateResult = () => {
        if (calc.sign && calc.num) {
            const result = calculate(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)), calc.sign);
            setCalc({
                ...calc,
                res: result === "Can't divide by 0" ? result : toLocaleString(result),
                sign: '',
                num: '',
            });
        }
    };

    const invertNumber = () => {
        setCalc({
            ...calc,
            num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : '',
            res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : '',
        });
    };

    const applyPercent = () => {
        const currentNum = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
        const result = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
        // Calculate percentage of the result if there's a result
        setCalc({
            ...calc,
            num: result ? (result / 100).toString() : (currentNum / 100).toString(),
            res: '',
            sign: '',
        });
    };

    const resetCalc = () => {
        setCalc({
            sign: '',
            num: '',
            res: '',
        });
    };

    return (
        <Paper
            style={{
                padding: '20px',
                width: '100%',
                maxWidth: '350px',
                margin: '0 auto',
                position: 'relative'
            }}
            elevation={3}
        >
            <TextField
                label="Expression"
                value={calc.num || calc.res || '0'}
                variant="outlined"
                fullWidth
                InputProps={{ readOnly: true }}
                style={{ marginBottom: '20px' }}
            />
            <Grid container spacing={1}>
                {btnValues.flat().map((btn, i) => (
                    <Grid item xs={btn === '=' ? 6 : 3} key={i}>
                        <Button
                            variant="contained"
                            color={btn === '=' ? 'secondary' : btn === 'C' ? 'default' : 'primary'}
                            fullWidth
                            onClick={() => handleButtonClick(btn)}
                            style={{
                                height: '100%',
                                backgroundColor: btn === 'C' ? '#f44336' : '',
                                color: btn === 'C' ? '#fff' : '',
                            }}
                        >
                            {btn}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default Calculator;
