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
import { UseIDs } from '../../config/SelectedIdsContext';
import HandleTableErrorCallback from '../../functions/pages/HandleTableErrorCallback';

const headers = [
  { key: '', label: '', className: 'bg-white text-center' },
  { key: 'balance', label: 'Balance', className: 'bg-white text-left' },
  { key: 'supplier', label: 'Supplier', className: 'bg-white text-left' },
  { key: 'amount', label: 'Amount', className: 'bg-white text-left' },
  { key: 'type', label: 'Type', className: 'bg-white text-left' },
  { key: 'note', label: 'Note', className: 'bg-white text-left' },
  { key: 'date', label: 'Date', className: 'bg-white text-left' },
  { key: 'action', label: 'Action', className: 'bg-white text-left' },
  { key: 'actions', label: 'Actions', className: 'bg-white text-center', sortable: false }
];

const tabs = [
  { url: '/ui/balances', title: 'Balances' },
  { url: '/ui/balances-history', title: 'Balances History' },
  { url: '/ui/incomes', title: 'Incomes' },
  { url: '/ui/expenses', title: 'Expenses' },
  { url: '/ui/transfers', title: 'Transfers' }
];

const Expense = () => {
  const heading = 'Expense'
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState(50); // Initialize rows state

  const [filters, setFilters] = useState([]);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const [currentFilter, setCurrentFilter] = useState({ balance_id: '', supplier_id: '', category_id: '', amount: '', type: '', note: '', date: '', action: '' });
  const [balances, setBalances] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const filterRecords = { balances, suppliers, categories };
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [numSelected, setNumSelected] = useState(0);
  const [selected, setSelected] = useState([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem('expenseColumns');
    return savedColumns ? JSON.parse(savedColumns) : [
        { name: 'attachment_file', label: 'Attachment', className: 'bg-white text-left', selected: true },
        { name: 'balance', label: 'Balance', className: 'bg-white text-left', selected: true },
        { name: 'supplier', label: 'Supplier', className: 'bg-white text-left', selected: true },
        { name: 'category', label: 'Category', className: 'bg-white text-left', selected: true },
        { name: 'amount', label: 'Amount', className: 'bg-white text-left', selected: true },
        { name: 'type', label: 'Type', className: 'bg-white text-left', selected: true },
        { name: 'note', label: 'Note', className: 'bg-white text-left', selected: false },
        { name: 'date', label: 'date', className: 'bg-white text-left', selected: true },
        { name: 'action', label: 'Action', className: 'bg-white text-left', selected: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('expenseColumns', JSON.stringify(columns));
  }, [columns]);

  const history = useHistory();

  const { ids, setIds } = UseIDs();

  const handleNavigation = () => {
    history.push('/ui/expense/create');
  };

  const fetchRecords = useCallback(() => {
    const errorCallback = (error) => {
      console.log('Error occurred:', error);
      // history.push('/ui/500'); // Navigate to the 500 error page
    };
    fetchAll(
      API_ENDPOINTS.GET_EXPENSES,
      page,
      rows,
      order,
      orderBy,
      filters,
      (data) => {
        setRecords(data);
        console.log(data)
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

  const handleSuppliers = (value) => {
    setSuppliers(value);
  }

  const handleCategories = (value) => {
    setCategories(value);
  }

  const handleBatchDelete = () => {
    const successCallback = (data) => {
      setNumSelected(0);
      setSelected([]);
      setIsSelectedAll(false);
      toast.success('Deleted Expenses Successfully');
    };

    const errorCallback = (error) => {
      HandleTableErrorCallback(error, 'Expense', ids, setIds);
    };

    handleBatchDeleteRecords(selected, API_ENDPOINTS.DELETE_EXPENSES, fetchRecords, successCallback, errorCallback)
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
          filterContent={<FilterContent currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} balances={balances} handleBalances={handleBalances} suppliers={suppliers} handleSuppliers={handleSuppliers} categories={categories} handleCategories={handleCategories} />}
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
          !loading && records.data.filter(item => item.type === 'EXPENSE').length === 0 ? (
            <NoRecords context='Expenses' />
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
        Heading='Expenses'
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

export default Expense