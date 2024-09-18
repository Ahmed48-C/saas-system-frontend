import axios from 'axios';

export const handleFetchRecord = (id, endpoint, setData, setLoading) => {
  setLoading(true); // Set loading to true before fetching data
  const url = endpoint(id);

  console.log('Fetching data from URL:', url);

  axios.get(url)
    .then(response => {
      console.log('Response data:', response.data);

      // Check if the response data is an object
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        setData(response.data);
      } else {
        console.error('Unexpected response data format:', response.data);
        // Optionally, handle unexpected data format
        setData({}); // Or set some default value
      }

      setLoading(false); // Set loading to false after data is fetched
    })
    .catch(error => {
      console.error('Error fetching data:', error.message);

      // Log the entire error object for more details
      console.error('Full error object:', error);

      // Optionally, handle error case
      setData({}); // Or set some default value
      setLoading(false); // Set loading to false in case of error
    });
};
