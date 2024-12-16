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
  { key: 'code', label: 'Code', className: 'bg-white text-left' },
  { key: 'price', label: 'Price', className: 'bg-white text-left' },
  { key: 'quantity', label: 'Quantity', className: 'bg-white text-left' },
  { key: 'total', label: 'Total', className: 'bg-white text-left' },
  { key: 'status', label: 'Status', className: 'bg-white text-left' },
];

const tabs = [
  { url: '/ui/balances', title: 'Balances' },
  { url: '/ui/balances-history', title: 'Balances History' },
  { url: '/ui/deposits', title: 'Deposits' },
  { url: '/ui/withdraws', title: 'Withdraws' },
  { url: '/ui/transfers', title: 'Transfers' }
];

const BalanceHistory = () => {
  const heading = 'Balance History'
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState(50); // Initialize rows state

  const [filters, setFilters] = useState([]);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const [currentFilter, setCurrentFilter] = useState({ amount: '', previous_amount: '', current_amount: '', balance_id: '', action: '', note: '', transfer_date: '' });
  const [balances, setBalances] = useState([]);
  const filterRecords = { balances };
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [numSelected, setNumSelected] = useState(0);
  const [selected, setSelected] = useState([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem('balanceHistoryColumns');
    return savedColumns ? JSON.parse(savedColumns) : [
      { name: 'amount', label: 'Amount', className: 'bg-white text-left', selected: true },
      { name: 'previous_amount', label: 'Previous Amount', className: 'bg-white text-left', selected: true },
      { name: 'current_amount', label: 'Current Amount', className: 'bg-white text-left', selected: true },
      { name: 'balance', label: 'Balance', className: 'bg-white text-left', selected: true },
      { name: 'action', label: 'Action', className: 'bg-white text-left', selected: true },
      { name: 'note', label: 'Note', className: 'bg-white text-left', selected: true },
      { name: 'transfer_date', label: 'Transfer Date', className: 'bg-white text-left', selected: true },
    ];
  });

  useEffect(() => {
    localStorage.setItem('balanceHistoryColumns', JSON.stringify(columns));
  }, [columns]);

  const history = useHistory();

  const { ids, setIds } = UseIDs();

  const fetchRecords = useCallback(() => {
    const errorCallback = (error) => {
      console.log('Error occurred:', error);
      // history.push('/ui/500'); // Navigate to the 500 error page
    };
    fetchAll(
      API_ENDPOINTS.GET_BALANCES_HISTORY,
      page,
      rows,
      order,
      orderBy,
      filters,
      (data) => {
        setRecords(data);
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

  const handleBalances = (value) => {
    setBalances(value);
  }

  const handleBatchDelete = () => {
    const successCallback = (data) => {
      setNumSelected(0);
      setSelected([]);
      setIsSelectedAll(false);
      toast.success('Deleted Balances History Successfully');
    };

    const errorCallback = (error) => {
      HandleTableErrorCallback(error, 'Balance History', ids, setIds);
    };

    handleBatchDeleteRecords(selected, API_ENDPOINTS.DELETE_BALANCES_HISTORY, fetchRecords, successCallback, errorCallback)
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
    const { totalAmount } = useMemo(() => {
      if (!Array.isArray(records.data) || records.data.length === 0) {
        return { totalAmount: 0 }; // Return default values if data is not available
      }

      return records.data.reduce(
        (acc, record) => {
          acc.totalAmount += parseFloat(record.amount) || 0;
          return acc;
        },
        { totalAmount: 0 }
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
                  <b className="font-size-lg pr-1">${totalAmount.toFixed(2)}</b>
                  <span className="text-black-50">Total Amount</span>
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
          filterContent={<FilterContent currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} balances={balances} handleBalances={handleBalances} />}
          filterRecords={filterRecords} // Pass records object
        />}
        tableHeading={<TableHeading
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headers={headers}
          columns={columns}
          isActions={false}
          isBatchDelete={false}
        />}
        tableContent={
          !loading && records.data.length === 0 ? (
            <NoRecords context='Balances History' />
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
        Heading='Balances History'
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
        isAddRecord={false}
      />
    </>
  )
}

export default BalanceHistory