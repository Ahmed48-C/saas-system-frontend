// import axios from 'axios';
import apiClient from '../../config/apiClient';

export const handleUpdateRecord = (id, updateData, endpoint, successCallback, errorCallback) => {
  let url = endpoint(id);

  apiClient.put(url, updateData)
    .then(response => {
      console.log('Update request successful:', response.data);
      if (successCallback) {
        successCallback(response.data);
      }
    })
    .catch(error => {
      console.error('Error making update request:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    });
};