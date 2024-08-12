import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const RemindersContext = createContext();

export const useReminders = () => useContext(RemindersContext);

export const RemindersProvider = ({ children }) => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false); // Optional: Loading state

    const fetchAllReminders = () => {
        setLoading(true);

        const errorCallback = (error) => {
            toast.error('Error ' + error.message);
        };

        axios.get(`http://127.0.0.1:8000/api/get/reminders/`)
            .then(response => {
                setReminders(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    };

    return (
        <RemindersContext.Provider value={{ reminders, setReminders, fetchAllReminders, loading, setLoading }}>
            {children}
        </RemindersContext.Provider>
    );
};
