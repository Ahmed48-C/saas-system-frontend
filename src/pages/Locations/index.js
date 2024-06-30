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

  const handleClick = () => {
    setShowCreate(prevShowCreate => !prevShowCreate);
  };

  // const fetchLocations = () => {
  //   setLoading(true);
  //   axios.get('http://127.0.0.1:8000/api/get/locations/')
  //     .then(response => {
  //       setLocations(response.data);
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   fetchLocations();
  // }, []);
  console.log(locations)

  const fetchLocations = () => {
    setLoading(true);
    let url = 'http://127.0.0.1:8000/api/get/locations/';
    if (order && orderBy) {
      url += `?order_by=${order === 'desc' ? '-' : ''}${orderBy}`;
    }
    axios.get(url)
      .then((response) => {
        setLocations(response.data);
        console.log("LOCATIONS : "+locations)
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLocations();
  }, [order, orderBy]);

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
          />
          :
          <CreateContent
            countryOptions={countryOptions}
            isEmpty={isEmpty}
            showSuccess={showSuccess}
            handleCloseSuccess={handleCloseSuccess}
            fetchLocations={fetchLocations}
            handleShowSuccess={handleShowSuccess}
          />
        }
        handleClick={handleClick}
        showCreate={showCreate}
      />
    </>
  )
}

export default Locations