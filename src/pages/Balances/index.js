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
    { key: 'amount', label: 'Amount', className: 'bg-white text-left' },
    { key: 'actions', label: 'Actions', className: 'bg-white text-center', sortable: false }
];

const tabs = [
    { url: '/ui/balances', title: 'Balances' },
    { url: '/ui/balances-history', title: 'Balances History' },
    { url: '/ui/incomes', title: 'Incomes' },
    { url: '/ui/expenses', title: 'Expenses' },
    { url: '/ui/transfers', title: 'Transfers' }
];

const Balances = () => {
    const heading = 'Balance'
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('id');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rows, setRows] = useState(50); // Initialize rows state

    const [filters, setFilters] = useState([]);
    const [anchorEl4, setAnchorEl4] = useState(null);
    const [currentFilter, setCurrentFilter] = useState({ name: '', amount: '', });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const [numSelected, setNumSelected] = useState(0);
    const [selected, setSelected] = useState([]);
    const [isSelectedAll, setIsSelectedAll] = useState(false);

    const [columns, setColumns] = useState(() => {
        const savedColumns = localStorage.getItem('balanceColumns');
        return savedColumns ? JSON.parse(savedColumns) : [
            { name: 'name', label: 'Name', className: 'bg-white text-left', selected: true },
            { name: 'amount', label: 'Amount', className: 'bg-white text-left', selected: true },
        ];
    });

    useEffect(() => {
        localStorage.setItem('balanceColumns', JSON.stringify(columns));
    }, [columns]);

    const history = useHistory();

    const { ids, setIds } = UseIDs();

    const handleNavigation = () => {
        history.push('/ui/balance/create');
    };

    const fetchRecords = useCallback(() => {
        const errorCallback = (error) => {
        console.log('Error occurred:', error);
        // history.push('/ui/500'); // Navigate to the 500 error page
        };
        fetchAll(
        API_ENDPOINTS.GET_BALANCES,
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

    const handleBatchDelete = () => {
        const successCallback = (data) => {
            setNumSelected(0);
            setSelected([]);
            setIsSelectedAll(false);
            toast.success('Deleted Balances Successfully');
        };

        const errorCallback = (error) => {
            HandleTableErrorCallback(error, 'Balance', ids, setIds);
        };

        handleBatchDeleteRecords(selected, API_ENDPOINTS.DELETE_BALANCES, fetchRecords, successCallback, errorCallback);
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
            filterContent={<FilterContent currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />}
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
                <NoRecords context='Balances' />
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
            Heading='Balances'
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

export default Balances