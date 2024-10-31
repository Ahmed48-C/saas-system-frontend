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
    { key: 'product', label: 'Product', className: 'bg-white text-left' },
    { key: 'store', label: 'Store', className: 'bg-white text-left' },
    { key: 'supplier', label: 'Supplier', className: 'bg-white text-left' },
    { key: 'actions', label: 'Actions', className: 'bg-white text-center', sortable: false }
];

const tabs = [
    { url: '/inventories', title: 'Inventories' }
];

const Inventories = () => {
    const heading = 'Inventory'
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);

    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('id');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rows, setRows] = useState(50); // Initialize rows state

    const [filters, setFilters] = useState([]);
    const [anchorEl4, setAnchorEl4] = useState(null);
    const [currentFilter, setCurrentFilter] = useState({ in_stock: '', on_order: '', reserved: '', min_stock: '', max_stock: '', product_id: '', store_id: '', supplier_id: '' });
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const filterRecords = { products, stores, suppliers };
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const [numSelected, setNumSelected] = useState(0);
    const [selected, setSelected] = useState([]);
    const [isSelectedAll, setIsSelectedAll] = useState(false);

    const [columns, setColumns] = useState(() => {
        const savedColumns = localStorage.getItem('inventoryColumns');
        return savedColumns ? JSON.parse(savedColumns) : [
            { name: 'in_stock', label: 'In Stock', className: 'bg-white text-left', selected: true },
            { name: 'on_order', label: 'On Order', className: 'bg-white text-left', selected: false },
            { name: 'reserved', label: 'Reserved', className: 'bg-white text-left', selected: false },
            { name: 'min_stock', label: 'Min Stock', className: 'bg-white text-left', selected: false },
            { name: 'max_stock', label: 'Max Stock', className: 'bg-white text-left', selected: false },
            { name: 'product', label: 'Product', className: 'bg-white text-left', selected: true },
            { name: 'store', label: 'Store', className: 'bg-white text-left', selected: true },
            { name: 'supplier', label: 'Supplier', className: 'bg-white text-left', selected: true }
        ];
    });

    useEffect(() => {
        localStorage.setItem('inventoryColumns', JSON.stringify(columns));
    }, [columns]);

    const history = useHistory();

    const { ids, setIds } = UseIDs();

    const handleNavigation = () => {
        history.push('/inventory/create');
    };

    const fetchRecords = useCallback(() => {
        const errorCallback = (error) => {
            console.log('Error occurred:', error);
            history.push('/500'); // Navigate to the 500 error page
        };

        fetchAll(
            API_ENDPOINTS.GET_INVENTORIES,
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
            errorCallback
        );
    }, [history, page, rows, order, orderBy, filters]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]); // Use the memoized fetchRecords

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

    const handleStores = (value) => {
        setStores(value);
    }

    const handleSuppliers = (value) => {
        setSuppliers(value);
    }

    const handleBatchDelete = () => {
        const successCallback = (data) => {
            setNumSelected(0);
            setSelected([]);
            setIsSelectedAll(false);
            toast.success('Deleted Inventories Successfully');
        };

        const errorCallback = (error) => {
            HandleTableErrorCallback(error, 'Inventory', ids, setIds);
        };

        handleBatchDeleteRecords(selected, API_ENDPOINTS.DELETE_INVENTORIES, fetchRecords, successCallback, errorCallback);
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
            filterContent={<FilterContent currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} products={products} handleProducts={handleProducts} stores={stores} handleStores={handleStores} suppliers={suppliers} handleSuppliers={handleSuppliers} />}
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
                <NoRecords context='Inventories' />
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
            Heading='Inventories'
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

export default Inventories