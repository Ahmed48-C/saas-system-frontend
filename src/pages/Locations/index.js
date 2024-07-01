import React, { useEffect, useState } from 'react'
import { MainTable } from '../../pages-components'
import { useCountries } from 'use-react-countries'
import axios from 'axios';
import NoRecords from '../../pages-components/NoRecords';
import EditContent from './EditContent';
import CreateContent from './CreateContent';
import TableContent from './TableContent';
import TableHeading from './TableHeading';

const headers = [
  { key: 'code', label: 'Code', className: 'bg-white text-left' },
  { key: 'name', label: 'Name', className: 'bg-white text-left' },
  { key: 'actions', label: 'Actions', className: 'bg-white text-center', sortable: false }
];

const Locations = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  const [showCreate, setShowCreate] = useState(false);

  const [recordId, setRecordId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [location, setLocation] = useState({});
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state

  const handleClick = () => {
    setShowCreate(prevShowCreate => !prevShowCreate);
  };

  // const fetchLocations = () => {
  //   setLoading(true);
  //   let url = 'http://127.0.0.1:8000/api/get/locations/';
  //   if (order && orderBy) {
  //     url += `?order_by=${order === 'desc' ? '-' : ''}${orderBy}`;
  //   }
  //   axios.get(url)
  //     .then((response) => {
  //       setLocations(response.data);
  //       console.log("LOCATIONS : "+locations)
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   fetchLocations();
  // }, [order, orderBy]);

  const fetchLocations = () => {
    setLoading(true);
    const pageSize = 5; // Number of items per page
    let url = `http://127.0.0.1:8000/api/get/locations/?from=${(page - 1) * pageSize}&to=${page * pageSize}`;
    if (order && orderBy) {
      url += `&order_by=${order === 'desc' ? '-' : ''}${orderBy}`;
    }
    axios.get(url)
      .then((response) => {
        console.log(response.data);
        setLocations(response.data); // Assuming API returns results in a `results` field
        setTotalPages(Math.ceil(response.data.actual_total_count / pageSize)); // Calculate total pages based on total count
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const resetLocations = () => {
    setLoading(true);
    const pageSize = 5; // Number of items per page
    let url = `http://127.0.0.1:8000/api/get/locations/?from=0&to=5`;
    if (order && orderBy) {
      url += `&order_by=${order === 'desc' ? '-' : ''}${orderBy}`;
    }
    axios.get(url)
      .then((response) => {
        console.log(response.data);
        setLocations(response.data); // Assuming API returns results in a `results` field
        setTotalPages(Math.ceil(response.data.actual_total_count / pageSize)); // Calculate total pages based on total count
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLocations(); // Fetch locations when component mounts or dependencies change
  }, [order, orderBy, page]);

  const { countries } = useCountries();

  const countryOptions = countries
      .map(country => ({
        name: country.name,
        value: country.name, // Setting value to country name
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

  const isEmpty = (field) => {
    return field === null || field === undefined || field === '';
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleShowSuccess = (value) => {
    setShowSuccess(value);
  };

  const handleEditMode = (value) => {
    setEditMode(value);
  };

  const handleLocation = (value) => {
    setLocation(value);
  };

  const handleEditLoading = (value) => {
    setEditLoading(value);
  };

  const handleRecordId = (value) => {
    setRecordId(value);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <MainTable
        tableHeading={<TableHeading
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headers={headers}
        />}
        tableContent={
          !loading && locations.length === 0 ? (
            <NoRecords context='Locations' />
          ) : (
            // <TableContent />
            <TableContent
              fetchLocations={fetchLocations}
              loading={loading}
              editLoading={editLoading}
              locations={locations}
              handleEditMode={handleEditMode}
              handleClick={handleClick}
              handleShowSuccess={handleShowSuccess}
              showSuccess={showSuccess}
              handleLocation={handleLocation}
              handleEditLoading={handleEditLoading}
              handleRecordId={handleRecordId}
              resetLocations={resetLocations}
            />
          )
        }
        Heading={editMode ? 'Update Location' : 'Add Location'}
        createContent={
          editMode ?
          <EditContent
            id={recordId}
            countryOptions={countryOptions}
            isEmpty={isEmpty}
            showSuccess={showSuccess}
            handleCloseSuccess={handleCloseSuccess}
            fetchLocations={fetchLocations}
            handleShowSuccess={handleShowSuccess}
            handleEditMode={handleEditMode}
            editLoading={editLoading}
            handleClick={handleClick}
            handleLocation={handleLocation}
            location={location}
            resetLocations={resetLocations}
          />
          :
          <CreateContent
            countryOptions={countryOptions}
            isEmpty={isEmpty}
            showSuccess={showSuccess}
            handleCloseSuccess={handleCloseSuccess}
            fetchLocations={fetchLocations}
            handleShowSuccess={handleShowSuccess}
            resetLocations={resetLocations}
            page={page}
          />
        }
        handleClick={handleClick}
        showCreate={showCreate}
        handlePageChange={handlePageChange} // Pass page change handler
        pageCount={totalPages} // Pass total pages
      />
    </>
  )
}

export default Locations