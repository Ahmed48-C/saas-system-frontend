import axios from 'axios';

export const handleFetchRecord = (id, endpoint, setData, setLoading) => {
  setLoading(true); // Set loading to true before fetching data
  const url = endpoint(id);

  axios.get(url)
    .then(response => {
      setData(response.data);
      setLoading(false); // Set loading to false after data is fetched
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false); // Set loading to false in case of error
    });
};