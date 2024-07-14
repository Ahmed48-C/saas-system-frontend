import React, { useEffect, useState } from 'react'
import { FilterBar, MainTable } from '../../pages-components'
import NoRecords from '../../pages-components/NoRecords';
import TableContent from './TableContent';
import { useHistory } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis';
import FilterContent from './FilterContent';
import TableHeading from '../../functions/pages/tableHeading';
import { fetchAll } from '../../functions/pages/handleFetchAll';

const headers = [
  { key: 'name', label: 'Name', className: 'bg-white text-left' },
  { key: 'phone', label: 'Phone', className: 'bg-white text-left' },
  { key: 'email', label: 'Email', className: 'bg-white text-left' },
  { key: 'actions', label: 'Actions', className: 'bg-white text-center', sortable: false }
];

const Supplier = () => {
  const heading = 'Supplier'
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 50;

  const [filters, setFilters] = useState([]);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const [currentFilter, setCurrentFilter] = useState({ name: '', phone: '', email: '', });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const history = useHistory();

  const handleNavigation = () => {
    history.push('/supplier/create');
  };

  const fetchSuppliers = () => {
    fetchAll(
      API_ENDPOINTS.GET_SUPPLIERS,
      page,
      pageSize,
      order,
      orderBy,
      filters,
      (data) => {
        setSuppliers(data);
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
    fetchSuppliers();
  }, [order, orderBy, page, filters]);

  useEffect(() => {
    if (filters.length > 0) {
      setPage(1);
    }
  }, [filters]);

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
          !loading && suppliers.data.length === 0 ? (
            <NoRecords context='Suppliers' />
          ) : (
            <TableContent
              fetchSuppliers={fetchSuppliers}
              loading={loading}
              suppliers={suppliers}
            />
          )
        }
        Heading='Suppliers'
        handleClick={handleNavigation}
        handlePageChange={handlePageChange}
        pageCount={totalPages}
        page={page}
      />
    </>
  )
}

export default Supplier