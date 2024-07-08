import React, { useCallback, useEffect, useState } from 'react'
import { FilterBar, MainTable } from '../../pages-components'
import axios from 'axios';
import NoRecords from '../../pages-components/NoRecords';
import TableContent from './TableContent';
import TableHeading from './TableHeading';
import { useHistory } from 'react-router-dom'; // Import useHistory
import API_ENDPOINTS from '../../config/apis';
import FilterContent from './FilterContent';


const headers = [
  { key: 'code', label: 'Code', className: 'bg-white text-left' },
  { key: 'name', label: 'Name', className: 'bg-white text-left' },
  { key: 'actions', label: 'Actions', className: 'bg-white text-center', sortable: false }
];

const Locations = () => {
  const heading = 'Locations'
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state

  const [filters, setFilters] = useState([]);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const [currentFilter, setCurrentFilter] = useState({ code: '', name: '', note: '', street: '', city: '', state: '', postcode: '', country: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const history = useHistory(); // Use the useHistory hook

  const handleNavigation = () => {
    history.push('/location/create'); // Navigate to the desired path
  };

  const fetchLocations = () => {
    setLoading(true);
    const pageSize = 5; // Number of items per page
    // let url = `http://127.0.0.1:8000/api/get/locations/?from=${(page - 1) * pageSize}&to=${page * pageSize}`;
    let url = API_ENDPOINTS.GET_LOCATIONS((page - 1) * pageSize, page * pageSize);
    if (order && orderBy) {
      url += `&order_by=${order === 'desc' ? '-' : ''}${orderBy}`;
    }
    if (Array.isArray(filters) && filters.length > 0) {
      url += `&filters=${JSON.stringify(filters)}`;
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
  }, [order, orderBy, page, filters]);


  // for warning: React Hook useEffect has a missing dependency: 'fetchLocations'. Either include it or remove the dependency array
  // const fetchLocations = useCallback(() => {
  //   setLoading(true);
  //   const pageSize = 5; // Number of items per page
  //   let url = API_ENDPOINTS.GET_LOCATIONS((page - 1) * pageSize, page * pageSize);
  //   if (order && orderBy) {
  //     url += `&order_by=${order === 'desc' ? '-' : ''}${orderBy}`;
  //   }
  //   axios.get(url)
  //     .then((response) => {
  //       console.log(response.data);
  //       setLocations(response.data); // Assuming API returns results in a `results` field
  //       setTotalPages(Math.ceil(response.data.actual_total_count / pageSize)); // Calculate total pages based on total count
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     });
  // }, [page, order, orderBy]);

  // useEffect(() => {
  //   fetchLocations(); // Fetch locations when component mounts or dependencies change
  // }, [fetchLocations]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // const handleChipClick = (event, index) => {
  //   const selectedFilter = filters[index];
  //   setCurrentFilter(selectedFilter);
  //   setIsEditing(true);
  //   setEditIndex(index);
  //   setAnchorEl4(event.currentTarget);
  // };

  // const handleClick = () => {
  //   const nonEmptyFilter = Object.fromEntries(
  //     Object.entries(currentFilter).filter(([_, value]) => value.trim() !== '')
  //   );

  //   if (isEditing) {
  //     const updatedFilters = [...filters];
  //     updatedFilters[editIndex] = nonEmptyFilter;
  //     setFilters(updatedFilters);
  //   } else {
  //     setFilters([...filters, nonEmptyFilter]);
  //   }
  //   handleCloseFilter();
  // };

  // const removeAllFilters = () => {
  //   setFilters([]);
  // };

  // const handleDelete = (index) => {
  //   const updatedFilters = filters.filter((_, i) => i !== index);
  //   setFilters(updatedFilters);
  // };

  // const handleClickFilter = (event) => {
  //   setAnchorEl4(event.currentTarget);
  // };

  // const handleCloseFilter = () => {
  //   setAnchorEl4(null);
  //   setCurrentFilter({ code: '', name: '', note: '', street: '', city: '', state: '', postcode: '', country: '' });
  //   setIsEditing(false);
  //   setEditIndex(null);
  // };

  // const isFormValid = () => {
  //   return Object.values(currentFilter).some(value => value.trim() !== '');
  // };

  // const formatFilter = (filter) => {
  //   return Object.entries(filter)
  //     .filter(([key, value]) => value.trim() !== '')
  //     .map(([key, value]) => `${key}: ${value}`)
  //     .join(', ');
  // };


  const handleAnchorEl4 = (value) => {
    setAnchorEl4(value);
  }

  const handleFilters = (value) => {
    setFilters(value);
  }

  const handleCurrentFilter = (value) => {
    setCurrentFilter(value);
  }

  const handleIsEditing = (value) => {
    setIsEditing(value);
  }

  const handleEditIndex = (value) => {
    setEditIndex(value);
  }

  return (
    <>
      <MainTable
        filterBar={<FilterBar
          filters={filters}
          // handleChipClick={handleChipClick}
          // handleClick={handleClick}
          // handleDelete={handleDelete}
          // removeAllFilters={removeAllFilters}
          // handleClickFilter={handleClickFilter}
          // handleCloseFilter={handleCloseFilter}
          setCurrentFilter={setCurrentFilter}
          setIsEditing={setIsEditing}
          setEditIndex={setEditIndex}
          anchorEl4={anchorEl4}
          open4={Boolean(anchorEl4)}
          // isFormValid={isFormValid}
          currentFilter={currentFilter}
          isEditing={isEditing}
          // formatFilter={formatFilter}
          heading={heading}
          handleAnchorEl4={handleAnchorEl4}
          handleFilters={handleFilters}
          handleCurrentFilter={handleCurrentFilter}
          handleIsEditing={handleIsEditing}
          handleEditIndex={handleEditIndex}
          editIndex={editIndex}
          filterContent={<FilterContent currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />}
        />}
        tableHeading={<TableHeading
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headers={headers}
        />}
        tableContent={
          !loading && locations.data.length === 0 ? (
            <NoRecords context='Locations' />
          ) : (
            <TableContent
              fetchLocations={fetchLocations}
              loading={loading}
              locations={locations}
            />
          )
        }
        Heading='Locations'
        handleClick={handleNavigation}
        handlePageChange={handlePageChange} // Pass page change handler
        pageCount={totalPages} // Pass total pages
      />
    </>
  )
}

export default Locations