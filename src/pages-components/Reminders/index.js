import { Button, FormControl, Grid, IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import API_ENDPOINTS from '../../config/apis';
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord';
import handleDeleteRecord from '../../functions/pages/handleDeleteRecord';
import Textarea from '../Textarea';
import isEmpty from '../../functions/pages/isEmpty';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import { format } from 'date-fns';
import Loader from '../Loader';
import DeleteIcon from '@material-ui/icons/Delete';
import { useReminders } from '../../config/RemindersContext';

const useStyles = makeStyles(() => ({
    disabledButton: {
        backgroundColor: '#BDBDBD',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#BDBDBD',
        },
    },
}));


const Reminders = () => {
    const classes = useStyles();
    const [data, setData] = useState({});
    const { reminders, loading, fetchAllReminders } = useReminders();

    useEffect(() => {
        fetchAllReminders();
    }, []);

    const isFormValid = () => {
        return  data.name &&
                data.date &&
                data.time;
    };

    const handleInputChange = (field) => (e) => {
        setData({ ...data, [field]: e.target.value });
    };

    const handlePickerInputChange = (field) => (value) => {
        setData({ ...data, [field]: value });
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const handleSubmitClick = () => {
        const formattedDate = format(data.date, 'yyyy-MM-dd'); // Format date
        const formattedTime = format(data.time, 'HH:mm:ss'); // Format time

        const postData = {
            name: data.name,
            date: formattedDate,
            time: formattedTime,
        };

        const successCallback = (data) => {
            fetchAllReminders();
            toast.success('Added Reminder Successfully');

            setData({
                name: '',
                date: null,
                time: null,
            });
        };

        const errorCallback = (error) => {
            toast.error('Error ' + error.message);

            setData({
                name: '',
                date: null,
                time: null,
            });
        };

        console.log(postData);

        handleSubmitRecord(postData, API_ENDPOINTS.POST_REMINDER, successCallback, errorCallback);
    };

    const handleDeleteClick = (id) => {
        const successCallback = (data) => {
            toast.success('Deleted Reminder Successfully');
        };

        const errorCallback = (error) => {
            toast.error('Error ' + error.message);
        };

        handleDeleteRecord(id, API_ENDPOINTS.DELETE_REMINDER, fetchAllReminders, successCallback, errorCallback)
    };

    return (
        <>
        <Paper style={{ padding: '20px', width: '100%', maxWidth: '500px', margin: '0 auto', position: 'relative', paddingRight: '52px' }} elevation={3}>
            <FormControl fullWidth>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={6}>
                    <Textarea
                    rows={1}
                    rowsMax={2}
                    label='Name'
                    name='name'
                    id='name'
                    onChange={handleInputChange('name')}
                    value={data.name ?? ""}
                    key='name'
                    error={isEmpty(data.name)}
                    maxLength={200}
                    />
                </Grid>
                <Grid item xs={6}>
                    <DatePicker
                    key='date'
                    id='date'
                    label='Date'
                    format='yyyy-MM-dd'
                    value={data.date ?? null}
                    onChange={handlePickerInputChange('date')}
                    disablePast='true'
                    error={isEmpty(data.date)}
                    name='date'
                    />
                </Grid>
                <Grid item xs={6}>
                    <TimePicker
                        id='time'
                        label='Time'
                        value={data.time ?? null}
                        key='time'
                        onChange={handlePickerInputChange('time')}
                        ampm={false}
                        minutesStep={1}
                        error={isEmpty(data.time)}
                        name='time'
                    />
                </Grid>
                <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', left: '16px' }}>
                    <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        handleSubmitClick(data);
                        setData({});
                    }}
                    disabled={!isFormValid()}
                    className={!isFormValid() ? classes.disabledButton : ''}
                    >
                    Add Reminder
                    </Button>
                </Grid>
            </Grid>
            </FormControl>

            {/* Display Reminders or Loader */}
            {loading ? (
                <Loader />
            ) : (
                reminders.length > 0 && (
                    <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '6px' }}>
                        {reminders
                            .sort((a, b) => (a.reached === b.reached) ? 0 : a.reached ? 1 : -1)
                            .map((reminder) => (
                                <Grid item xs={12} key={reminder.id}>
                                    <Paper
                                        elevation={3}
                                        style={{
                                            padding: '10px',
                                            position: 'relative',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: reminder.reached ? '#f8d7da' : '#ffffff',
                                            borderColor: reminder.reached ? '#f5c6cb' : '#ddd',
                                            borderStyle: 'solid',
                                            borderWidth: '1px'
                                        }}
                                    >
                                        <div>
                                            <Typography variant="body2"><strong>Name:</strong> {truncateText(reminder.name, 45)}</Typography>
                                            <Typography variant="body2"><strong>Date:</strong> {reminder.date}</Typography>
                                            <Typography variant="body2"><strong>Time:</strong> {reminder.time}</Typography>
                                        </div>
                                        <IconButton color="primary" onClick={() => handleDeleteClick(reminder.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Paper>
                                </Grid>
                            ))}
                    </Grid>
                )
            )}
        </Paper>
        </>
    )
}

export default Reminders