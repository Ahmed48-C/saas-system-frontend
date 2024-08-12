import React, { useEffect } from 'react';
import './assets/base.scss';
import configureStore from './config/configureStore';
import { Provider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import Routes from './Routes';
import ScrollToTop from './utils/ScrollToTop';
import { RemindersProvider, useReminders } from './config/RemindersContext';
import axios from 'axios';
import API_ENDPOINTS from './config/apis';
import reminderSound from './assets/images/reminder-sound.mp3';

const store = configureStore();

function App() {
  return (
    <RemindersProvider>
      <Provider store={store}>
        <ToastContainer
          position="bottom-center"
          limit={3}
        />
        <ReminderWatcher /> {/* Separate the reminder logic here */}
        <BrowserRouter>
          <ScrollToTop>
            <Routes />
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    </RemindersProvider>
  );
}

function ReminderWatcher() {
  const { reminders, fetchAllReminders } = useReminders(); // Assuming fetchAllReminders is a method to refetch reminders
  const alarmSound = new Audio(reminderSound); // Provide the correct path to your sound file

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

  useEffect(() => {
      const interval = setInterval(() => {
          const now = new Date();
          reminders.forEach(reminder => {
              const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
              if (reminderTime <= now && !reminder.reached) {
                alarmSound.play().catch(error => {
                  console.error("Audio playback failed:", error);
                });
                  // Show the toast notification
                  toast.info(`Reminder: ${truncateText(reminder.name, 25)}`, {
                    autoClose: false,      // The toast will not automatically close
                    closeOnClick: true,    // The toast can be closed by clicking on it
                  });
                  // Update the reminder as reached
                  updateReminderAsReached(reminder);
              }
          });
      }, 20000); // Check every 20s

      return () => clearInterval(interval);
  }, [reminders]);

  const updateReminderAsReached = (reminder) => {
      let url = API_ENDPOINTS.PUT_REMINDER(reminder.id)
      const updateData = {
        name: reminder.name,
        date: reminder.date,
        time: reminder.time,
        reached: true,
      };

      axios.put(url, updateData)
        .then(response => {
            fetchAllReminders(); // Re-fetch the reminders after updating
        })
        .catch(error => {
            console.error('Error updating reminder:', error);
        });
  };

  return null; // This component doesn't render anything
}

export default App;