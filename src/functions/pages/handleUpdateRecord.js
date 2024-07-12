import axios from 'axios';

export const handleUpdateRecord = (id, updateData, endpoint, successCallback, errorCallback) => {
  let url = endpoint(id);

  axios.put(url, updateData)
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