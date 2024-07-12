import React, { useCallback, useEffect, useState } from 'react'
import { FilterBar, MainTable } from '../../pages-components'
import axios from 'axios';
import NoRecords from '../../pages-components/NoRecords';
import TableContent from './TableContent';
import { useHistory } from 'react-router-dom'; // Import useHistory
import API_ENDPOINTS from '../../config/apis';
import FilterContent from './FilterContent';
import TableHeading from '../../functions/pages/tableHeading';
import { fetchAll } from '../../functions/pages/handleFetchAll';

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
  const pageSize = 5;

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
    fetchAll(
      API_ENDPOINTS.GET_LOCATIONS,
      page,
      pageSize,
      order,
      orderBy,
      filters,
      (data) => {
        setLocations(data);
        if (data.actual_total_count) {
          setTotalPages(Math.ceil(data.actual_total_count / pageSize));
        } else {
          setTotalPages(0);
        }
        setLoading(false);
      },
      setLoading
    );
  };

  useEffect(() => {
    fetchLocations();
  }, [order, orderBy, page, filters]);

  useEffect(() => {
    if (filters.length > 0) {
      setPage(1);
    }
  }, [filters]);

  // const fetchLocations = () => {
  //   fetchAll(API_ENDPOINTS.GET_LOCATIONS, page, pageSize, order, orderBy, filters, setLocations, setLoading);
  // };

  // useEffect(() => {
  //   fetchLocations(); // Fetch locations when component mounts or dependencies change
  // }, [order, orderBy, page, filters]);

  // useEffect(() => {
  //   if (locations.actual_total_count) {
  //     setTotalPages(Math.ceil(locations.actual_total_count / pageSize));
  //   }
  // }, [locations]);

  // useEffect(() => {
  //   setPage(1); // Reset to the first page when filters change
  // }, [filters]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

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
          setCurrentFilter={setCurrentFilter}
          setIsEditing={setIsEditing}
          setEditIndex={setEditIndex}
          anchorEl4={anchorEl4}
          open4={Boolean(anchorEl4)}
          currentFilter={currentFilter}
          isEditing={isEditing}
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
        page={page}
      />
    </>
  )
}

export default Locations