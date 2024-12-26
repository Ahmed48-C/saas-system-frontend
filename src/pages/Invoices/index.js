import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { UseIDs } from '../../config/SelectedIdsContext';
import HandleTableErrorCallback from '../../functions/pages/HandleTableErrorCallback';
import { Card, CardContent, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons'; // Import the money sign icon

const headers = [
  { key: '', label: '', className: 'bg-white text-center' },
  { key: 'code', label: 'Code', className: 'bg-white text-left' },
  { key: 'price', label: 'Price', className: 'bg-white text-left' },
  { key: 'quantity', label: 'Quantity', className: 'bg-white text-left' },
  { key: 'total', label: 'Total', className: 'bg-white text-left' },
  { key: 'status', label: 'Status', className: 'bg-white text-left' },
  { key: 'actions', label: 'Actions', className: 'bg-white text-center', sortable: false }
];

const tabs = [
  { url: '/ui/invoices', title: 'Invoice' },
  { url: '/ui/sale-orders', title: 'Sale Order' },
  { url: '/ui/delivery-sale-orders', title: 'Delivery Sale Order' },
  { url: '/ui/completed-sale-orders', title: 'Completed Sale Order' },
  { url: '/ui/cancelled-sale-orders', title: 'Cancelled Sale Order' },
];

const Invoice = () => {
  const heading = 'Invoice'
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState(50); // Initialize rows state

  const [filters, setFilters] = useState([]);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const [currentFilter, setCurrentFilter] = useState({ number: '', date: '', due_date: '', payment_method: '', total: '', note: '', customer_id: '', location_id: '', items__product_id: '', items__price: '', items__quantity: '', items__total: '' });
  const [customers, setCustomers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);
  const filterRecords = { customers, locations, products };
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [numSelected, setNumSelected] = useState(0);
  const [selected, setSelected] = useState([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem('invoiceColumns');
    return savedColumns ? JSON.parse(savedColumns) : [
      { name: 'attachment_file', label: 'Attachment', className: 'bg-white text-left', selected: true },
      { name: 'number', label: 'Number', className: 'bg-white text-left', selected: true },
      { name: 'date', label: 'Date', className: 'bg-white text-left', selected: true },
      { name: 'due_date', label: 'Due Date', className: 'bg-white text-left', selected: true },
      { name: 'items', label: 'Items', className: 'bg-white text-left', selected: true },
      { name: 'payment_method', label: 'Payment Method', className: 'bg-white text-left', selected: true },
      { name: 'total', label: 'Total', className: 'bg-white text-left', selected: true },
      { name: 'note', label: 'Note', className: 'bg-white text-left', selected: false },
      { name: 'customer', label: 'Customer', className: 'bg-white text-left', selected: true },
      { name: 'location', label: 'Location', className: 'bg-white text-left', selected: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('invoiceColumns', JSON.stringify(columns));
  }, [columns]);

  const history = useHistory();

  const { ids, setIds } = UseIDs();

  const handleNavigation = () => {
    history.push('/ui/invoice/create');
  };

  const fetchRecords = useCallback(() => {
    const errorCallback = (error) => {
      console.log('Error occurred:', error);
      // history.push('/ui/500'); // Navigate to the 500 error page
    };
    fetchAll(
      API_ENDPOINTS.GET_INVOICES,
      page,
      rows,
      order,
      orderBy,
      filters,
      (data) => {
        setRecords(data);
        console.log(data);
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
    fetchRecords();
  }, [fetchRecords]);

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

  const handleProducts = (value) => {
    setProducts(value);
  }

  const handleCustomers = (value) => {
    setCustomers(value);
  }

  const handleLocations = (value) => {
    setLocations(value);
  }

  const handleBatchDelete = () => {
    const successCallback = (data) => {
      setNumSelected(0);
      setSelected([]);
      setIsSelectedAll(false);
      toast.success('Deleted Invoices Successfully');
    };

    const errorCallback = (error) => {
      HandleTableErrorCallback(error, 'Invoice', ids, setIds);
    };

    handleBatchDeleteRecords(selected, API_ENDPOINTS.DELETE_INVOICES, fetchRecords, successCallback, errorCallback)
  }

  const handleSelectAll = () => {
    const allIds = records.data.map(record => record.id);
    setSelected(allIds);
    setNumSelected(allIds.length);
    setIsSelectedAll(true);
  }

  const handleDeselectAll = () => {
    setSelected([]);
    setNumSelected(0);
    setIsSelectedAll(false);
  }

  const MoneyInfo = () => {
    const { total } = useMemo(() => {
      if (!Array.isArray(records.data) || records.data.length === 0) {
        return { total: 0 }; // Return default values if data is not available
      }

      return records.data.reduce(
        (acc, record) => {
          acc.total += parseFloat(record.total) || 0;
          return acc;
        },
        { total: 0 }
      );
    }, [records.data]); // Make sure to include records.data in the dependency array

    return (
      <Grid container>
        <Grid item xl={12} md={12}>
          <Card className="card-box card-box-border-bottom border-success">
            <CardContent style={{ paddingBottom: 0 }}>
              <div className="text-center">
                <div className="mt-1">
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    className="font-size-xxl text-success"
                  />
                </div>
                <div className="mt-3 line-height-sm mb-2">
                  <b className="font-size-lg pr-1">${total.toFixed(2)}</b>
                  <span className="text-black-50">Total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

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
          filterContent={<FilterContent currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} products={products} handleProducts={handleProducts} customers={customers} handleCustomers={handleCustomers} locations={locations} handleLocations={handleLocations} />}
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
          !loading && records.data.length === 0 ? (
            <NoRecords context='Invoices' />
          ) : (
            <TableContent
              fetchRecords={fetchRecords}
              loading={loading}
              records={records}
              numSelected={numSelected}
              handleNumSelected={handleNumSelected}
              selected={selected}
              handleSelected={handleSelected}
              handleIsSelectedAll={handleIsSelectedAll}
              columns={columns}
            />
          )
        }
        Heading='Invoices'
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
        contentAboveFilter={<MoneyInfo />}
      />
    </>
  )
}

export default Invoice