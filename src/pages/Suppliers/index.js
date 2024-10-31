import React, { useCallback, useEffect, useState } from 'react'
import { FilterBar, MainTable } from '../../pages-components'
import NoRecords from '../../pages-components/NoRecords';
import TableContent from './TableContent';
import { useHistory } from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/apis';
import FilterContent from './FilterContent';
import TableHeading from '../../functions/pages/tableHeading';
import { fetchAll } from '../../functions/pages/handleFetchAll';
import handleBatchDeleteRecords from '../../functions/pages/handleBatchDeleteRecords';
import { toast } from 'react-toastify';
import HandleTableErrorCallback from '../../functions/pages/HandleTableErrorCallback';
import { UseIDs } from '../../config/SelectedIdsContext';

const headers = [
  { key: '', label: '', className: 'bg-white text-center' },
  { key: 'name', label: 'Name', className: 'bg-white text-left' },
  { key: 'phone', label: 'Phone', className: 'bg-white text-left' },
  { key: 'email', label: 'Email', className: 'bg-white text-left' },
  { key: 'actions', label: 'Actions', className: 'bg-white text-center', sortable: false }
];

const tabs = [
  { url: '/suppliers', title: 'Suppliers' },
  { url: '/customers', title: 'Customers' }
];

const Supplier = () => {
  const heading = 'Supplier'
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState(50); // Initialize rows state

  const [filters, setFilters] = useState([]);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const [currentFilter, setCurrentFilter] = useState({ name: '', phone: '', email: '', contact_name: '', contact_phone: '', location_id: '' });
  const [locations, setLocations] = useState([]);
  const filterRecords = { locations };
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [numSelected, setNumSelected] = useState(0);
  const [selected, setSelected] = useState([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem('supplierColumns');
    return savedColumns ? JSON.parse(savedColumns) : [
      { name: 'name', label: 'Name', className: 'bg-white text-left', selected: true },
      { name: 'phone', label: 'Phone', className: 'bg-white text-left', selected: true },
      { name: 'email', label: 'Email', className: 'bg-white text-left', selected: true },
      { name: 'contact_name', label: 'Contact Name', className: 'bg-white text-left', selected: false },
      { name: 'contact_phone', label: 'Contact Phone', className: 'bg-white text-left', selected: false },
      { name: 'location', label: 'location', className: 'bg-white text-left', selected: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('supplierColumns', JSON.stringify(columns));
  }, [columns]);

  const history = useHistory();

  const { ids, setIds } = UseIDs();

  const handleNavigation = () => {
    history.push('/supplier/create');
  };

  const fetchSuppliers = useCallback(() => {
    const errorCallback = (error) => {
      history.push('/500'); // Navigate to the 500 error page
    };
    fetchAll(
      API_ENDPOINTS.GET_SUPPLIERS,
      page,
      rows,
      order,
      orderBy,
      filters,
      (data) => {
        setSuppliers(data);
        if (data.actual_total_count) {
          setTotalPages(Math.ceil(data.actual_total_count / rows));
        } else {
          setTotalPages(0);
        }
        setLoading(false);
      },
      setLoading,
      errorCallback,
    );
  }, [history, order, orderBy, page, filters, rows]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

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

  const handleNumSelected = (value) => {
    setNumSelected(value);
  }

  const handleSelected = (value) => {
    setSelected(value);
  }

  const handleIsSelectedAll = (value) => {
    setIsSelectedAll(value);
  }

  const handleRows = (value) => {
    setRows(value);
  }

  const handleColumns = (value) => {
    setColumns(value);
  }

  const handleLocations = (value) => {
    setLocations(value);
  }

  const handleBatchDelete = () => {
    const successCallback = (data) => {
      setNumSelected(0);
      setSelected([]);
      setIsSelectedAll(false);
      toast.success('Deleted Suppliers Successfully');
    };

    const errorCallback = (error) => {
      HandleTableErrorCallback(error, 'Supplier', ids, setIds);
    };

    handleBatchDeleteRecords(selected, API_ENDPOINTS.DELETE_SUPPLIERS, fetchSuppliers, successCallback, errorCallback);
  }

  const handleSelectAll = () => {
    const allIds = suppliers.data.map(record => record.id);
    setSelected(allIds);
    setNumSelected(allIds.length);
    setIsSelectedAll(true);
  }

  const handleDeselectAll = () => {
    setSelected([]);
    setNumSelected(0);
    setIsSelectedAll(false);
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
          filterContent={<FilterContent currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} locations={locations} handleLocations={handleLocations} />}
          filterRecords={filterRecords} // Pass records object
        />}
        tableHeading={<TableHeading
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headers={headers}
          columns={columns}
        />}
        tableContent={
          !loading && suppliers.data.length === 0 ? (
            <NoRecords context='Suppliers' />
          ) : (
            <TableContent
              fetchSuppliers={fetchSuppliers}
              loading={loading}
              suppliers={suppliers}
              numSelected={numSelected}
              handleNumSelected={handleNumSelected}
              selected={selected}
              handleSelected={handleSelected}
              handleIsSelectedAll={handleIsSelectedAll}
              columns={columns}
            />
          )
        }
        Heading='Suppliers'
        handleClick={handleNavigation}
        handlePageChange={handlePageChange}
        pageCount={totalPages}
        page={page}
        numSelected={numSelected}
        handleBatchDelete={handleBatchDelete}
        handleSelectAll={handleSelectAll}
        handleDeselectAll={handleDeselectAll}
        isSelectedAll={isSelectedAll}
        rows={rows} // Pass rows state
        handleRows={handleRows} // Pass setRows function
        columns={columns}
        handleColumns={handleColumns}
        tabs={tabs}
      />
    </>
  )
}

export default Supplier